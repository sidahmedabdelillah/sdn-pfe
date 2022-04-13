__author__ = 'Ehsan'
from mininet.node import CPULimitedHost
from mininet.topo import Topo
from mininet.link import Link
from mininet.net import Mininet
from mininet.log import setLogLevel, info
from mininet.node import RemoteController
from mininet.cli import CLI
from mininet.link import TCLink
"""
Instructions to run the topo:
    1. Go to directory where this filw is.
    2. run: sudo -E python STP_topo.py

This file is used in STP.md tutorial
"""


class ThreeSWloop(Topo):
    """Simple topology example."""

    def __init__(self, **opts):
        """Create custom topo."""

        # Initialize topology
        super(ThreeSWloop, self).__init__(**opts)
        #Topo.__init__(self)

        # Add hosts and switches
        h1 = self.addHost('h1', ip='10.0.0.1', mac="00:00:00:00:00:01")
        h2 = self.addHost('h2', ip='10.0.0.2', mac="00:00:00:00:00:02")
        h3 = self.addHost('h3', ip='10.0.0.3', mac="00:00:00:00:00:03")
        h4 = self.addHost('h4', ip='10.0.0.4', mac="00:00:00:00:00:04" )
        h5 = self.addHost('h5' ,ip='10.0.0.5', mac="00:00:00:00:00:05")
        h6 = self.addHost('h6' ,ip='10.0.0.6', mac="00:00:00:00:00:06")



        opts = dict(protocols='OpenFlow13')

        # Adding switches
        s1 = self.addSwitch('s1', dpid="0000000000000001")


        # Add links
        self.addLink(h1, s1)
        self.addLink(h2, s1)
        self.addLink(h3, s1)
        self.addLink(h4, s1)
        self.addLink(h5, s1)
        self.addLink(h6, s1)




def run():
    c = RemoteController('c', '127.0.0.1', 6633)
    net = Mininet(topo=ThreeSWloop(),  controller=None)
    net.addController(c)
    net.start()

    # installStaticFlows( net )
    CLI(net)
    net.stop()

# if the script is run directly (sudo custom/optical.py):
if __name__ == '__main__':
    setLogLevel('info')
    run()
