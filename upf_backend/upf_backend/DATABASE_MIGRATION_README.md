
# Plan: Switching to Django's Custom User System

## Goals
- Replace PostgreSQL-managed users table with Django-managed one.
- Enable full Django user management: login/logout, password hashing, admin panel support, future user extensions.

# NOTE: TO BACKUP THE DB, RUN THE FOLLOWING IN TERMINAL:
``` pg_dump -U [insert db user here] -d [insert db name here] -f [backup filename you want here.sql]```

OPTION 1: (SAFER - Renaming the existing table instead of dropping it)
Steps
1. Confirm we are using `CustomUser(AbstractUser)` in models.py.
2. In settings.py, confirm this line exists:
    python
   AUTH_USER_MODEL = 'users.CustomUser'
3. Temporarily rename the existing table in PostgreSQL:
    ALTER TABLE users RENAME TO users_backup;
4. Drop the foreign key from 'survey' table if needed:
    ALTER TABLE survey DROP CONSTRAINT survey_user_id_fkey;
5. Run Django migrations:
    cd upf_backend
    python manage.py makemigrations users
    python manage.py migrate
6. Create a Django superuser to test login/admin:
    python manage.py createsuperuser
RESULT: The app now uses Django's user system and has all the benefits of password hashing automatically taken care of, etc., and the old database data is still safe in 'users_backup'





OPTION 2: DROP THE EXISTING 'users' TABLE (CAUTION: THIS WILL DELETE ALL EXISTING USER RECORDS)

1. Confirm we are using `CustomUser(AbstractUser)` in models.py.
2. In settings.py, confirm this line exists:
    ```python
   AUTH_USER_MODEL = 'users.CustomUser'
3. In models.py, change Meta:
    class Meta:
        db_table = 'users'
        # Remove 'managed = False'
4. Drop the foreign jkey constraint in PostgreSQL:
    ALTER TABLE survey DROP CONSTRAINT survey_user_id_fkey;
5. Drop the 'users' table:
    DROP TABLE users;
    Why? --> Django can’t migrate over a table that already exists with the same name but different structure.
5. Run (while in upf_backend folder)
    python manage.py makemigrations users
    python manage.py migrate
6. Create a new superuser:
    python manage.py createsuperuser




## CHECKS
1. users/models.py uses CustomUser(AbstractUser) --> survey relies on users as a foreign key (FOREIGN KEY (user_id) REFERENCES users(user_id)) so, it now will include: from django.conf import settings
AND
user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
2. Review field name mismatches within the frontend pages (where they might use user_user_name, user_email, user_id for example) --> DONE, NO CHANGES REQUIRED
3. Since we are switching to CustomUser; we need to make sure that users/admin.py is registering the new model properly;
    --> add the changes outlined in the comments in admin.py:
    from django.contrib.auth.admin import UserAdmin
    from .models import CustomUser, Survey

    admin.site.register(CustomUser, UserAdmin)
    admin.site.register(Survey)

4. Make sure to check for user_user_name and user_email in the schema - anywhere that refers to those field names will break when switching to CustomUser, since Django uses 'username' instead of 'user_name', and 'email' instead of 'user_email'
5. a psql query to copy old users into the new table, if necessary
6. In models.py, make sure to remove managed = False or change it to True if letting Django manage the database
7. DATABASE SCHEMA CHANGES REQUIRED:
    ## In the 'users' table:
    user_id --> change to id (Django uses just id)
    user_email --> email
    user_user_name --> username

    ## In the 'survey' table:
    No change required necessarily but user_id will map to Django's user.id
8. OPTIONAL: RE-INSERT OLD USERS FROM BACKUP CREATED USING TERMINAL COMMAND AT THE TOP OF THIS FILE
    ```sql
    INSERT INTO users (id, username, email, user_dob, user_consent)
    SELECT user_id, user_user_name, user_email, user_dob, user_consent FROM users_backup;
    ```



NOTES:
The existing PostgreSQL setup remains fully stable
Any other tables than user are __unaffected__ -- with the exception of the examples above which we have accounted for
We can still use Django models to create new tables and manage them via migrations
All non-auth-related Postgres functionality stays just as it was
IF RAW SQL IN CUSTOM SCRIPTS OR DATA INSERTS: make sure it matches the new table/column structure
Post-migration these things stay the same:
We can still add more fields to CustomUser if needed
Can still create and link new tables in Django using the ForeignKey(CustomUser,...)
Can still use the admin panel to manage users - which is now easier and more secure
Can keep working as usual with psql or pgadmin. psql is a command-line tool that lets you interact with PostgreSQL database, pgadmin is the GUI (graphical interface) for managing postgreSQL databases.