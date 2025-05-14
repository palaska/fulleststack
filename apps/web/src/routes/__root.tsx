import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { Session, User } from "@/web/lib/auth-client";

import { AppNavbar } from "@/web/components";

type AppContext = {
  auth: {
    user: User | null;
    session: Session | null;
    isPending: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
  };
};

export const Route = createRootRouteWithContext<AppContext>()({
  component: () => (
    <div className="min-h-full">
      <AppNavbar />
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
});
