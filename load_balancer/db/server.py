import sys


sys.path.append('..')

from typing import List

from db import connection
from classes import Server

def get_servers_from_db() -> List[Server]:
    
    with connection:
        servers = []
        cursor = connection.cursor()
        servers_sql = cursor.execute(""" SELECT * from servers """)
        for row in servers_sql :
            servers.append(Server(row[1],row[0],row[2]))
    return servers

    
def add_server_to_db(ip : str,mac : str,port : int) ->Server:
    with connection:
        cursor = connection.cursor()

        cursor.execute("INSERT INTO servers(ip,mac,port) VALUES(?,?,?)",(ip,mac,port))
    return Server(ip,mac,port)

def delete_server_from_db_with_mac(mac : str):
    with connection:
        cursor = connection.cursor()
        sql = "DELETE FROM servers WHERE mac =  '" + mac + "'"
        cursor.execute(sql)
        return get_servers_from_db()



