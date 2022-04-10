from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER
from ryu.controller.handler import set_ev_cls
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet
from ryu.lib.packet import ether_types
from ryu.lib.packet import ipv4
from ryu.lib.mac import haddr_to_int
from ryu.lib.packet.ether_types import ETH_TYPE_IP
from ryu.lib.packet import arp
from ryu.lib.packet import ethernet

from db import get_server_with_mac, get_servers_from_db, get_server_with_ip
from random import choice

class SimpleSwitch13(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    # server virtual IP
    VIRTUAL_IP = '10.0.0.100'  # The virtual server IP

    servers = get_servers_from_db()

    # # srver 1 config
    # SERVER1_IP = '10.0.0.5'
    # SERVER1_MAC = '00:00:00:00:00:05'
    # SERVER1_PORT = 5

    # #server 2 config
    # SERVER2_IP = '10.0.0.6'
    # SERVER2_MAC = '00:00:00:00:00:05'
    # SERVER2_PORT = 6

    # mac table 
    ip_to_mac = {"10.0.0.1": "00:00:00:00:00:01",
                 "10.0.0.2": "00:00:00:00:00:02",
                 "10.0.0.3": "00:00:00:00:00:03",
                 "10.0.0.4": "00:00:00:00:00:04"}


    def __init__(self, *args, **kwargs):
        super(SimpleSwitch13, self).__init__(*args, **kwargs)
        self.mac_to_port = {}
    
    # table-miss flow
    @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)
    def switch_features_handler(self, ev):
        datapath = ev.msg.datapath
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser

        # install table-miss flow entry
        #
        # We specify NO BUFFER to max_len of the output action due to
        # OVS bug. At this moment, if we specify a lesser number, e.g.,
        # 128, OVS will send Packet-In with invalid buffer_id and
        # truncated packet data. In that case, we cannot output packets
        # correctly.  The bug has been fixed in OVS v2.1.0.
        match = parser.OFPMatch()
        actions = [parser.OFPActionOutput(ofproto.OFPP_CONTROLLER,
                                          ofproto.OFPCML_NO_BUFFER)]
        self.add_flow(datapath, 0, match, actions)

    # add flow function 
    def add_flow(self, datapath, priority, match, actions, buffer_id=None):
        self.logger.info('adding-flow')
        # open-flow protocol
        ofproto = datapath.ofproto
        # open-flow parser
        parser = datapath.ofproto_parser

        inst = [parser.OFPInstructionActions(ofproto.OFPIT_APPLY_ACTIONS,
                                             actions)]
        if buffer_id:
            mod = parser.OFPFlowMod(datapath=datapath, buffer_id=buffer_id,
                                    priority=priority, match=match,
                                    instructions=inst)
        else:
            mod = parser.OFPFlowMod(datapath=datapath, priority=priority,
                                    match=match, instructions=inst)
        datapath.send_msg(mod)

    # handle packetIn event (no flow match)
    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def _packet_in_handler(self, ev):
        # If you hit this you might want to increase
        # the "miss_send_length" of your switch
        if ev.msg.msg_len < ev.msg.total_len:
            self.logger.debug("packet truncated: only %s of %s bytes",
                              ev.msg.msg_len, ev.msg.total_len)
        # event message
        msg = ev.msg
        # event datapath (switch)
        datapath = msg.datapath
        # event openflow protocol
        ofproto = datapath.ofproto
        # protocol parser
        parser = datapath.ofproto_parser

        # in port 
        in_port = msg.match['in_port']
        
        # packet
        pkt = packet.Packet(msg.data)
        # ethernet frame
        eth = pkt.get_protocols(ethernet.ethernet)[0]


        if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            # ignore lldp packet (discoery)
            return
        
        # destination mac_address
        dst_mac = eth.dst
        # source mac_address
        src_mac = eth.src

        # datapath_id (switch_id)
        dpid = datapath.id

        # get the mac table for the switch_id otherwise set it to empy dict
        self.mac_to_port.setdefault(dpid, {})

        # log the packet "packet in switch_id source_mac destination_mac in_port"
        self.logger.info("packet in %s %s %s %s", dpid, src_mac, dst_mac, in_port)

        # learn a mac address to avoid FLOOD next time.
        self.mac_to_port[dpid][src_mac] = in_port
        
        if dst_mac in self.mac_to_port[dpid]:
            # if the destination mac is previously learned get it from the dict
            out_port = self.mac_to_port[dpid][dst_mac]
        else:
            # else flood the packet
            out_port = ofproto.OFPP_FLOOD

        # set the action to output from the port (mac_port or flood)
        actions = [parser.OFPActionOutput(out_port)]

        # install a flow to avoid packet_in next time
        if out_port != ofproto.OFPP_FLOOD:
            match = parser.OFPMatch(in_port=in_port, eth_dst=dst_mac, eth_src=src_mac)
            # verify if we have a valid buffer_id, if yes avoid to send both
            # flow_mod & packet_out
            if msg.buffer_id != ofproto.OFP_NO_BUFFER:
                self.add_flow(datapath, 10, match, actions, msg.buffer_id)
                return
            else:
                self.add_flow(datapath, 10, match, actions)

        # Handle ARP Packet
        if eth.ethertype == ether_types.ETH_TYPE_ARP:
            arp_header = pkt.get_protocol(arp.arp)

            if arp_header.dst_ip == self.VIRTUAL_IP and arp_header.opcode == arp.ARP_REQUEST:
                self.logger.info("***************************")
                self.logger.info("---Handle ARP Packet---")
                # Build an ARP reply packet using source IP and source MAC
                reply_packet = self.generate_arp_reply(arp_header.src_ip, arp_header.src_mac)
                actions = [parser.OFPActionOutput(in_port)]
                packet_out = parser.OFPPacketOut(datapath=datapath, in_port=ofproto.OFPP_ANY,
                                                 data=reply_packet.data, actions=actions, buffer_id=0xffffffff)
                datapath.send_msg(packet_out)
                self.logger.info("Sent the ARP reply packet")
                return

        # Handle TCP Packet
        if eth.ethertype == ETH_TYPE_IP:
            self.logger.info("***************************")
            self.logger.info("---Handle TCP Packet---")
            ip_header = pkt.get_protocol(ipv4.ipv4)
            self.logger.info(ip_header)

            # send to the function
            # handle_tcp_packet(self, datapath, in_port, ip_header, parser, dst_mac, src_mac):
            packet_handled = self.handle_tcp_packet(datapath, in_port, ip_header, parser, dst_mac, src_mac)
            self.logger.info("my-log in_port=%s ,  eth_type=%s , ip_proto=%s ,ipv4_dst=%s", in_port, ETH_TYPE_IP, ip_header.proto, self.VIRTUAL_IP)
            self.logger.info("TCP packet handled: " + str(packet_handled))
            if packet_handled:
                return

        # Send if other packet
        data = None
        if msg.buffer_id == ofproto.OFP_NO_BUFFER:
            data = msg.data

        out = parser.OFPPacketOut(datapath=datapath, buffer_id=msg.buffer_id,
                                  in_port=in_port, actions=actions, data=data)
        datapath.send_msg(out)

    # Source IP and MAC passed here now become the destination for the reply packet
    def generate_arp_reply(self, dst_ip, dst_mac):
        self.logger.info("Generating ARP Reply Packet")
        self.logger.info("ARP request client ip: " + dst_ip + ", client mac: " + dst_mac)
        arp_target_ip = dst_ip  # the sender ip
        arp_target_mac = dst_mac  # the sender mac
        # Making the load balancer IP as source IP
        src_ip = self.VIRTUAL_IP

        # chosing a random server from the servers array
        chosen_server = choice(self.servers)
        src_mac = chosen_server.mac


        # logging the chosen mac
        self.logger.info("Selected server MAC: " + src_mac)

        pkt = packet.Packet()

        # adding ethernet header to packet (source and destination mac)
        pkt.add_protocol(
            ethernet.ethernet(
                dst=dst_mac, src=src_mac, ethertype=ether_types.ETH_TYPE_ARP)
        )

        # adding arp response to packet
        pkt.add_protocol(
            arp.arp(opcode=arp.ARP_REPLY, src_mac=src_mac, src_ip=src_ip,
                    dst_mac=arp_target_mac, dst_ip=arp_target_ip)
        )

        # encode the packet for sending
        pkt.serialize()
        self.logger.info("Done with processing the ARP reply packet")
        return pkt

    # function to handle tcp packets
    def handle_tcp_packet(self, datapath, in_port, ip_header, parser, dst_mac, src_mac):
        packet_handled = False

        # if the packet is for the VIRTUAL_IP
        if ip_header.dst == self.VIRTUAL_IP:

            # find the packet with the chosen mac
            chosen_server = get_server_with_mac(dst_mac)

            if(not chosen_server):
                self.logger.error('Requested server Not found')
                return
            
            server_dst_ip = chosen_server.ip
            server_out_port = chosen_server.port



            # Route to server
            # create a flow match for :
            #           in_port: in_port
            #           eth_type: ip
            #           ip_propotocl: protocol_header
            #           ipv4 _dst= 10.0.0.100

            match = parser.OFPMatch(in_port=in_port, eth_type=ETH_TYPE_IP, ipv4_dst=self.VIRTUAL_IP)


            actions = [parser.OFPActionSetField(ipv4_dst=server_dst_ip),
                       parser.OFPActionOutput(server_out_port)]

            self.logger.warning('adding-flow from handle tcp')
            self.add_flow(datapath, 15, match, actions)
            self.logger.info("<==== Added TCP Flow- Route to Server: " + str(server_dst_ip) +
                             " from Client :" + str(ip_header.src) + " on Switch Port:" +
                             str(server_out_port) + "====>")

            # Reverse route from server
            match = parser.OFPMatch(in_port=server_out_port, eth_type=ETH_TYPE_IP,
                                    ipv4_src=server_dst_ip,
                                    eth_dst=src_mac)
                                    
            actions = [parser.OFPActionSetField(ipv4_src=self.VIRTUAL_IP),
                       parser.OFPActionOutput(in_port)]

            self.logger.warning('adding-flow from handle tcp reverse')

            self.add_flow(datapath, 13, match, actions)
            self.logger.info("<==== Added TCP Flow- Reverse route from Server: " + str(server_dst_ip) +
                             " to Client: " + str(src_mac) + " on Switch Port:" +
                             str(in_port) + "====>")
            packet_handled = True
        return packet_handled
