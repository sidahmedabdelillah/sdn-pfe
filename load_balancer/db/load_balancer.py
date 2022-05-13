TABLE_NAME = "load_balancers"


from typing import List
from classes.server import Server
from db import connection

from classes import LoadBalancer

def get_load_balancers_from_db() -> List[LoadBalancer]:
    with connection:
        load_balancers = []
        cursor = connection.cursor()
        load_balancers_sql = cursor.execute(
            """
            SELECT * from {}
            """.format(TABLE_NAME)
        )

        for row in load_balancers_sql:
            load_balancers.append(LoadBalancer(row[0] , row[1], row[2]))
        
        return load_balancers

def get_servers_for_load_balancer_from_db(id: str) -> List[Server] :
    with connection :
        servers = []
        cursor = connection.cursor()
        print ('SELECT * FROM servers WHERE load_balancer_id = ' , id)

        servers_sql = cursor.execute(
            """
            SELECT * FROM servers WHERE load_balancer_id = '{}'
            """.format(id) 
        ) 

        for row in servers_sql :
            servers.append(Server(row[1],row[0],row[2]))

        return servers


    
def add_loadbalancer_to_db(dpid: str , method : int,virtual_ip):
    with connection:
        cursor = connection.cursor()

        sql = "INSERT INTO {}(id,method,virtual_ip) VALUES(?,?,?) ".format(TABLE_NAME)
        cursor.execute(sql , (dpid,method,virtual_ip))
        return LoadBalancer(dpid,method,virtual_ip)

def delete_loadbalancer_from_db(dpid:str):
    with connection:
        cursor = connection.cursor()

        sql = "DELETE FROM {} WHERE id = '{}'".format(TABLE_NAME,dpid)
        cursor.execute(sql)
        return get_load_balancers_from_db()