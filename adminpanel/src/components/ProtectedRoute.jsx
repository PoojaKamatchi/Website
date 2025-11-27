import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Example usage
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
