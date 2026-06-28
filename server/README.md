# Google Meet Integration Server

This server provides a Google OAuth flow, sync endpoint, and local storage for Google Meet recordings.

## Setup

1. Copy `server/.env.example` to `server/.env`.
2. Fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `SESSION_SECRET`.
3. Make sure the redirect URI matches `http://localhost:4000/auth/google/callback`.

## Run

From the repository root:

```bash
pnpm run server
```

## Endpoints

- `GET /auth/google` - redirect to Google authorization
- `GET /auth/google/callback` - callback URL for Google OAuth
- `GET /api/auth/status` - returns whether Google Meet is connected
- `GET /api/meetings` - returns synced meeting recordings metadata
- `POST /api/meetings/sync` - sync new Google Meet recordings from Google Drive

## Storage

- `server/data/recordings.json` stores synced recording metadata.
- `server/storage/meetings/` stores downloaded recording files.
