import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import type { Session, User } from "../lib/auth-client";

import AppNavbar from "../components/app-navbar";

type AppContext = {
  session?: Session;
  user?: User;
};

// Better-Auth session context type
export const Route = createRootRouteWithContext<AppContext>()({
  component: () => (
    <>
      <AppNavbar />
      <main className="container" style={{ marginTop: "1rem" }}>
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </>
  ),
});
