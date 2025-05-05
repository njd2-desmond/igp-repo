# igp-repo
## Repository for Interdisciplinary Group Project, Group 16

- Nick Desmond
- Alice Pateman-Brown
- Yusuf Ajala (Aj)
- Jordan Edgecombe
- Collins Madubuchi


-- NOTE {} Denotes a code chunk

Note on copying the repo, pushing code, dependencies and gitignore: node_modules/ is ignored in .gitignore because it gets installed separately using npm install.

.next/ is the build output directory for the Next.js project. It contains cached files, compiled code, and server-side rendering (SSR) artefacts. .next/ should not be in the repo because these artefacts are generated each time you run:

    {npm run build}

.next/ varies by environment (local dev vs. production) and is also large and would make the repo unnecessarily big

db.sqlite3 (database) databases should not be pushed to github

Django Admin Panel is accessible at http://127.0.0.1:8000/admin/


Users App:
The users app handles everything related to user management, including: User registration/signup; Login & Authentication; Storing & Validating user data (name, DOB, dietary preferences, etc); Handling user onboarding survey; User profile management

Chatbot development IMPORTANT NOTE:
API KEYS SHOULD NOT BE HARCODED INTO PUBLICLY DEPLOYED CODE
-- API keys should be retrieved by load_dotenv and os.getenv
-- API keys should be added to env files (there is one in the chatbot folder) - env files do not get added to git, since they are added to the .gitignore file -- inside main project folder 18/03/25 (see this line; .env.local)
-- Alice update 2/5/2025 - .env file now moved into root upf_backend folder

to run postgresql: (ADD NON MAC VERSION)
brew install postgresql 

brew services start postgresql 
^ This starts the database server and keeps it running in the background

Then run:
psql postgres

Then inside psql shell, which looks like postgres=#   run:
CREATE DATABASE upf_unwrapped;

If that works, you'll see:
CREATE DATABASE

Then type:
\q
to exit.


To finish database setup on local machine;
pip install psycopg2-binary
^ installs psycopg2, which is the PostgreSQL adapter for Python. It lets the Django backend talk to a PostgreSQL database using Python. Django can't connect to PostgreSQL on its own; it needs psycopg2 to work properly, otherwise you'll get connection errors or module import errors.
psycopg2 - requires building from source and can cause install issues on Mac/Windows; but psycopg2 is the precompiled version which is safe and fast to install

ALSO:
pip install django-environ
^ This installs the package Django needs to read your .env file

once installed:

RUN IN PROJECT ROOT (i.e. wherever you have set up the project to live on your system)
python manage.py makemigrations
python manage.py migrate

^ This will create the users table and set up all Django auth tables insode upf_unwrapped PostgreSQL database

NOTE: SPACES AROUND = ARE NOT ALLOWED IN .env FILES

