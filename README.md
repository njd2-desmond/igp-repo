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
