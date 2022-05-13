from ryu.lib.ip import valid_ipv4
from ryu.lib.mac import HADDR_PATTERN
from ryu.lib.dpid import _DPID_LEN


import re

def validate_ip(ip):
    return valid_ipv4(ip)

def validate_mac(mac):
    return re.fullmatch(HADDR_PATTERN, mac)

def validate_int(i):
    if type(i) == int : return True
    return i.isnumeric()

def validate_dpid(dpid):
    return len(dpid) == _DPID_LEN
