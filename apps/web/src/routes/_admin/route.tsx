import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/web/lib/auth-client'
import { useAuth } from '@/web/hooks/useAuth';
import { useEffect } from 'react';

export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ context, location }) => {
    const { auth: { isPending, isAdmin } } = context;

    if (isPending) {
      const { data } = await authClient.getSession()
      if (!data || data.user.role !== 'admin') {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        })
      }

      return;
    }

    if (!isAdmin) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: _Admin,
})

function _Admin() {
  const { isPending, isAdmin } = useAuth();
  const navigate = useNavigate();
  const redirect = useLocation({
    select: (location) => location.search.redirect,
  })

  useEffect(() => {
    if (!isPending && !isAdmin) {
      navigate({
        to: '/login',
        search: { redirect },
      });
    }
  }, [isAdmin, isPending, navigate, redirect]);

  return <Outlet />
}
