# NITM Internal App (Monorepo)

This repository is a starter scaffold for the NITM internal app MVP.

Structure:
- `backend/` — Node.js + TypeScript + Express backend with Prisma schema
- `admin/` — React admin panel skeleton (React Admin recommended)
- `mobile/` — Flutter mobile app skeleton

Next steps:
1. Install backend dependencies and set up `.env` with Postgres connection.
2. Run Prisma migrate to create DB schema.
3. Start backend: `npm run dev` from `backend/`.
4. Open `admin/` and `mobile/` directories for further work.

If you want, I can initialize Git, run the first install commands, or implement the authentication flow next.

Docker (no local Node/npm required)
----------------------------------
If you cannot or don't want to install Node.js locally, use Docker Compose to run Postgres + backend locally.

From the repository root:

```powershell
docker compose up --build
```

The backend will be available at `http://localhost:4000` and the Postgres DB at port `5432`.

To stop and remove containers:

```powershell
docker compose down
```
