from ryu.lib.ip import valid_ipv4
from ryu.lib.mac import HADDR_PATTERN

import re

def validate_ip(ip):
    return valid_ipv4(ip)

def validate_mac(mac):
    return re.fullmatch(HADDR_PATTERN, mac)

def validate_int(i):
    if type(i) == int : return True
    return i.isnumeric()