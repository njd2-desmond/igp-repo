from sqlalchemy import Column, Integer, String # Column in database table - to define each field of the model. Integer and String are built in SQLAlchemy column types
from sqlalchemy.ext.declarative import declarative_base # <-- This is a factory function that returns a base class you can extend to create models. Any clas that inherits from this base class becomes an SQLAlchemy model, with table mappings, columns, etc




# Integer maps to an integer column in the database (for example INT in PostgreSQL)
# String maps to a variable-length string column (e.g. VARCHAR in PostgreSQL).


Base = declarative_base()  # This creates a base class called Base
# Below, where we define a model class, User, we are inheriting from Base. This signals to SQLAlchemy that
# User is a table-mapped class.
# Base also collects metadata about all the models (table names, columns) so that it can create or reflect tables

class User(Base): # define a new Python class named User, which inherits from Base --> This is how SQLAlchemy knows User is an ORM "model" describing a database table.
    # (ORM = Object Relational Mapping - a programing technique for converting data between a relational database and the memory of an object-oriented programming language)
    __tablename__ = "fastapi_users" # define name of the fastapi users database
    id = Column(Integer, primary_key=True, index=True) # creates a column named id in the table
    name = Column(String, nullable=False) # Creates a 'name' column of type String
    email = Column(String, unique=True, index=True, nullable=False) # creates an 'email' column of type String.
    # ^ index=True tells SQLAlchemy to create a database index on this column, making lookups by id faster
    # nullable = False means this column cannot be NULL in the database, so every user must have a name.
    hashed_password = Column(String, nullable=False) # Hashed password column type String. nullable=False because a user must always have a hashed password



# POSTGRESQL: Once PostgreSQL is set up and running, with a database name, user,
# password, and host, all that's needed to to update the SQLAlchemy connection to point to
# that database instead of the local SQLite file.

