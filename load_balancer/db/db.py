import sqlite3 
from inspect import getmembers, isfunction


connection =  sqlite3.connect('load_balancer.sqlite')

from db import migrations

def _migrations_table_exists():
    with connection:
        cursor = connection.cursor()
        r = cursor.execute("""
            SELECT name FROM sqlite_master WHERE type='table' AND name='migration';
            """)
        for row in r :
            if(row[0]) == 'migration' : return True
        return False

def _get_last_migration():
    if not _migrations_table_exists() : return 1

    with connection:
        cursor = connection.cursor()
        r = cursor.execute("""
            SELECT * from migration limit 1
        """)
        for row in r:
            return row[1] + 1


def migrate():
    last_migration = _get_last_migration()

    all_migrations = getmembers(migrations, isfunction)

    running_migrations = all_migrations[last_migration - 1:]

    for migration_name , migration in running_migrations:
        print("running migration " , migration_name)
        migration(connection)
        with connection:
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE migration SET number = ? WHERE id = 1 " 
            ,(str(last_migration)))
            last_migration = last_migration + 1
    
    print("database migration done")

migrate()