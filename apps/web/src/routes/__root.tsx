import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import AppNavbar from "../components/AppNavbar";
import type { User, Session } from "@/web/lib/auth-client";

type AppContext = {
  auth: {
    user: User | null;
    session: Session | null;
    isPending: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
  }
};

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
