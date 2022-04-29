TABLE_NAME = "load_balancers"


from typing import List
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
            load_balancers.append(LoadBalancer(row[0] , row[1]))
        
        return load_balancers

