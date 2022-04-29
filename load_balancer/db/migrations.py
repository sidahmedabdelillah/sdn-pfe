from sqlite3 import Connection, Cursor

def __01__create__migrations__table(db : Connection):
    with db :
        cursor = db.cursor()
        cursor.execute("""
            CREATE TABLE migration(id int , number int)
        """)
        cursor.execute(
            """
            INSERT INTO migration(id , number ) values (1,1)
            """
        )

def __02__create__load_balancers__list(db:Connection):
    with db:
        cursor = db.cursor()
        cursor.execute(
            """
            CREATE TABLE load_balancers(id char(16) PRIMARY KEY , method int)
            """
        )


def __03__create__servers__database(db : Connection):
    with db:
        cursor = db.cursor()
        cursor.execute(
            """
            CREATE TABLE servers(
                mac varchar(17), 
                ip varchar(20), 
                port int,
                load_balancer_id char(16),
                FOREIGN KEY (load_balancer_id) REFERENCES parent(load_balancers)
                )
            """
        )

