# Mobile (Flutter)

This is a Flutter app skeleton for NITM with login and home screens. To run:

```powershell
cd mobile
flutter pub get
flutter run
```

Features implemented:
- Authentication (login/logout) with JWT token storage.
- Home screen with quick action cards (notices, room booking, food order, vehicle booking).
- Role-based greeting (displays user role and name).
- Provider pattern for state management (AuthProvider).
- HTTP client integration with backend API.

Next tasks:
- Add Notices list and detail views.
- Add Room/Vehicle booking forms with date and item selection.
- Add Food ordering with menu and cart.
- Implement FCM for push notifications.
- Add approval notifications and status tracking for approvers (HOD/Admin).
- Local caching with offline support.

