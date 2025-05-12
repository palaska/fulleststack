import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Navbar from "../components/Navbar";
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
    <div className="min-h-full">
      <Navbar />
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
});
