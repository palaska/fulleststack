import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/web/hooks/useAuth";
import { authClient } from "@/web/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const { auth: { isLoggedIn, isPending } } = context;

    if (isPending) {
      const { data } = await authClient.getSession();
      if (!data) {
        throw redirect({
          to: "/signin",
          search: { redirect: location.href },
        });
      }

      return;
    }

    if (!isLoggedIn) {
      throw redirect({
        to: "/signin",
        search: { redirect: location.href },
      });
    }
  },
  component: _Authenticated,
});

function _Authenticated() {
  const { isLoggedIn, isPending } = useAuth();
  const navigate = useNavigate();
  const redirect = useLocation({
    select: location => location.search.redirect,
  });

  useEffect(() => {
    if (!isPending && !isLoggedIn) {
      navigate({
        to: "/signin",
        search: { redirect },
      });
    }
  }, [isLoggedIn, isPending, navigate, redirect]);

  return <Outlet />;
}
