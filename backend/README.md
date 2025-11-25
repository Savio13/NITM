# Backend (Node.js + TypeScript)

Quick start:

1. Copy `.env.example` to `.env` and fill `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

```powershell
cd backend
npm install
```

3. Generate Prisma client and run migrations (example):

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

4. Start dev server:

```powershell
npm run dev
```

API root should respond at `http://localhost:4000/`.

Next tasks:
- Implement auth routes, RBAC middleware, and booking endpoints.
- Wire up FCM for push notifications.
