# Admin Panel (React Admin)

React Admin dashboard for managing NITM users, bookings, and approvals. To run:

```powershell
cd admin
npm install
npm run dev
```

Open http://localhost:3000 in your browser. Use credentials from the backend to log in.

Features implemented:
- JWT authentication with local storage.
- Dashboard with pending approvals count and total users.
- User management (list, create, edit) with role selection.
- Booking list and detail view.
- Approval workflow with Approve/Reject buttons.
- Material-UI theming with dark mode support (can be added).
- API integration via React Admin data provider.

Environment variables:
- `VITE_API_URL` (default: http://localhost:4000) — backend API URL.

Next tasks:
- Add reports and export (CSV).
- Add audit log viewer.
- Add notice/thought-of-day composer for admins.
- Add settings for approval rules and working hours.
- Add resource management (rooms, vehicles, menu items).

