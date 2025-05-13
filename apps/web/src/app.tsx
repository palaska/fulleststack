import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "@/web/route-tree.gen";

import { useAuth } from "./hooks/useAuth";

const router = createRouter({
  routeTree,
  context: {
    auth: {
      user: null,
      session: null,
      isPending: false,
      isLoggedIn: false,
      isAdmin: false,
    },
  },
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { user, session, isPending, isLoggedIn, isAdmin } = useAuth();
  return (
    <RouterProvider
      router={router}
      context={{
        auth: { user, session, isPending, isLoggedIn, isAdmin },
      }}
    />
  );
}
