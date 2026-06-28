
  # Design DecisionOS SaaS Application

  This is a code bundle for Design DecisionOS SaaS Application. The original project is available at https://www.figma.com/design/BCTkO6biuOC6qNHjg9KYqs/Design-DecisionOS-SaaS-Application.

  ## Running the code

  Run `pnpm install` to install the dependencies.

  Run `pnpm run dev` to start the frontend development server.

  Run `pnpm run server` in a separate terminal to start the Google Meet integration backend.

  ## Google Meet integration setup

  1. Copy `server/.env.example` to `server/.env`.
  2. Fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `SESSION_SECRET`.
  3. Create Google OAuth credentials in the Google Cloud Console with redirect URI:
     `http://localhost:4000/auth/google/callback`.
  4. Open the frontend and go to `Department Settings` > `Knowledge Sources`.
  5. Click `Connect` on Google Meet to authorize and then use `Sync` to pull recordings.
  