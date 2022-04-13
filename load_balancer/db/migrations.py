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


def __02__create__servers__database(db : Connection):
    with db:
        cursor = db.cursor()
        cursor.execute(
            """
            CREATE TABLE servers(mac varchar(17), ip varchar(20), port int)
            """
        )

