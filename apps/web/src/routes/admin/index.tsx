import { createFileRoute, Navigate } from "@tanstack/react-router";

// Admin route that serves as a wrapper for all admin routes
// It checks if the user is authenticated and has admin role
export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  // If user is not authenticated or not an admin, redirect to home
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-layout">
      <h1>Admin Dashboard</h1>
    </div>
  );
}
