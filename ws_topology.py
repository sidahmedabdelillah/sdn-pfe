from socket import error as SocketError
from tinyrpc.exc import InvalidReplyError
from operator import attrgetter



from ryu.app.wsgi import (
    ControllerBase,
    WSGIApplication,
    websocket,
)
from ryu.base import app_manager
from ryu.topology import  switches
from ryu.controller.handler import set_ev_cls
from ryu.controller import ofp_event
from ryu.controller.handler import MAIN_DISPATCHER, DEAD_DISPATCHER

from ryu.lib import hub

from ryu.app.wsgi import WebSocketRPCServer

import json

simple_switch_instance_name = 'simple_switch_api_app'
url = '/simpleswitch/ws'




class WebSocketTopology(app_manager.RyuApp):

    # add the wsgi  ( web server app )
    # to run in the context of this app
    _CONTEXTS = {
        'wsgi': WSGIApplication,
    }

    def __init__(self, *args, **kwargs):
        super(WebSocketTopology, self).__init__(*args, **kwargs)

        self.datapaths = {}
        self.monitor_thread = hub.spawn(self._monitor)

        wsgi = kwargs['wsgi']
        wsgi.register(
            WebSocketTopologyController,
            data={simple_switch_instance_name: self},
        )
        self._ws_manager = wsgi.websocketmanager




    # handeling state switch state change 
    # if the switch is connected || turned on the event in on the main dispatcher
    # if the siwtch is disconnected || turned off the event in on the dead dispatcher
    @set_ev_cls(ofp_event.EventOFPStateChange,
                [MAIN_DISPATCHER, DEAD_DISPATCHER])
    def _state_change_handler(self, ev):
        datapath = ev.datapath

        # if the event in on the MAIN_DISPATCHER add the siwtch to datapaths
        if ev.state == MAIN_DISPATCHER:
            if datapath.id not in self.datapaths:
                self.logger.debug('register datapath: %016x', datapath.id)
                self.datapaths[datapath.id] = datapath

        # if the event is on DEAD_DIPATHCER remove the switch from datapaths
        elif ev.state == DEAD_DISPATCHER:
            if datapath.id in self.datapaths:
                self.logger.debug('unregister datapath: %016x', datapath.id)
                del self.datapaths[datapath.id]


    # a method for monitoring 
    def _monitor(self):
        # send a port state request every 1 second
        while True:
            for dp in self.datapaths.values():
                self._request_stats(dp)
            hub.sleep(1)

    # a method to handle open flow porte state replys
    @set_ev_cls(ofp_event.EventOFPPortStatsReply, MAIN_DISPATCHER)
    def _port_stats_reply_handler(self, ev):
        body = ev.msg.body

        # self.logger.info('datapath         port     '
        #                  'rx-pkts  rx-bytes rx-error '
        #                  'tx-pkts  tx-bytes tx-error')
        # self.logger.info('---------------- -------- '
        #                  '-------- -------- -------- '
        #                  '-------- -------- --------')

        # for each port of the siwtch
        for stat in sorted(body, key=attrgetter('port_no')):
            # self.logger.info('%016x %8x %8d %8d %8d %8d %8d %8d',
            #                  ev.msg.datapath.id, stat.port_no,
            #                  stat.rx_packets, stat.rx_bytes, stat.rx_errors,
            #                  stat.tx_packets, stat.tx_bytes, stat.tx_errors)
            
            # send a message with the switch the port and the packet_in / out over websocket
            msg = {
                "method" : "event_switch-stats" ,
                "data":{
                "switch" : 'switch-' + format(ev.msg.datapath.id, '016d') ,
                "port" : format(stat.port_no, '08d'),
                "speed_in" : stat.rx_bytes,
                "speed_out" : stat.tx_bytes
                }
            }
            self._ws_manager.broadcast(json.dumps(msg))



    # a method to send porte state requent to switch
    def _request_stats(self, datapath):
        self.logger.debug('send stats request: %016x', datapath.id)
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser

        req = parser.OFPFlowStatsRequest(datapath)
        datapath.send_msg(req)

        req = parser.OFPPortStatsRequest(datapath, 0, ofproto.OFPP_ANY)
        datapath.send_msg(req)    



# the controller to setup the webserver (websocket server)
class WebSocketTopologyController(ControllerBase):

    def __init__(self, req, link, data, **config):
        super(WebSocketTopologyController, self).__init__(
            req, link, data, **config)
        self.simple_switch_app = data[simple_switch_instance_name]

    @websocket('simpleswitch', url)
    def _websocket_handler(self, ws):
        simple_switch = self.simple_switch_app
        simple_switch.logger.debug('WebSocket connected: %s', ws)
        rpc_server = WebSocketRPCServer(ws, simple_switch)
        rpc_server.serve_forever()
        simple_switch.logger.debug('WebSocket disconnected: %s', ws)