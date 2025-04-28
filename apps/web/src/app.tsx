import { createRouter, RouterProvider } from "@tanstack/react-router";

import { useSession } from "@/web/lib/auth-client";
import { routeTree } from "@/web/route-tree.gen";

const router = createRouter({
  routeTree,
  context: {
    session: undefined,
    user: undefined,
  },
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { data } = useSession();
  const { session, user } = data ?? {};
  return <RouterProvider router={router} context={{ session, user }} />;
}
