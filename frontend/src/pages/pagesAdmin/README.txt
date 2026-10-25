# Family Expense Management — Admin UI

## Files
- AdminDashboard.jsx / AdminDashboard.css: admin shell, sidebar, topbar, nested routes.
- AdminOverview.jsx / AdminOverview.css: overview and dashboard metrics.
- AdminUsers.jsx / AdminUsers.css: user list, search, role change, edit, delete, lock/unlock (demo state only).
- AdminGroups.jsx / AdminGroups.css: group usage monitoring.
- AdminAIUsage.jsx / AdminAIUsage.css: AI bill scanning metrics and recent scans.
- AdminPlans.jsx / AdminPlans.css: plan cards and demo plan editor.

## Dependencies
From your frontend folder run:
`npm install lucide-react chart.js react-chartjs-2`

The app uses React Router v6 (`react-router-dom`).

## App.jsx / App.js route
Import AdminDashboard and use a wildcard route:
```jsx
import AdminDashboard from "./pages/admin/AdminDashboard";

<Route
  path="/admin/*"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```
Adjust the import path if your folder structure differs.

## Important
- These pages are UI prototypes using sample data only.
- Editing, deleting, locking, role changes, and plan editing only affect local React state.
- The logout button clears localStorage keys `token`, `user`, and `role` then navigates to `/login`. Remove or adapt this if your auth flow differs.
- No admin UI for family funds or transactions is included.
- For production, enforce authorization and role checks on backend APIs. Do not rely on frontend route guards alone.
