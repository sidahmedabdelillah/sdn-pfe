from typing import List
from sqlalchemy import null
from tinydb import TinyDB, Query

db = TinyDB("loadbalancer.json")
from classes.server import Server





def get_servers_from_db() -> List[Server]:
    serversDb = db.table('server')
    serversDict = (serversDb.all())

    servers = []
    for server in serversDict:
        servers.append(Server(server['ip'],server['mac'],server['port']))
    
    return servers

def add_server_to_db(ip,mac,port) -> Server:
    serversDb = db.table('server')

    serversDb.insert({"ip" : ip , "mac" : mac , "port" : port})

    return Server(ip,mac,port)

def get_server_with_ip(ip) -> Server:
    serversDb = db.table('server')
    serverQuerry = Query()

    res = serversDb.get(serverQuerry.ip == ip)
    if res :
        return Server(res['ip'] , res['mac'] , res['port'])
    return null

def get_server_with_mac(mac) -> Server:
    serversDb = db.table('server')
    serverQuerry = Query()

    res = serversDb.get(serverQuerry.mac == mac)
    if res :
        return Server(res['ip'] , res['mac'] , res['port'])
    return null



print(get_servers_from_db())

