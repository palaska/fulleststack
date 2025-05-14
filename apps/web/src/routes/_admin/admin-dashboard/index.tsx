import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { listUsersQueryOptions } from "@/web/lib/queries/admin";
import queryClient from "@/web/lib/query-client";

import { UsersTable } from "./-components/UsersTable";
import { useEffect, useMemo } from "react";
import { z } from "zod";

const PAGE_SIZE = 5;

export const Route = createFileRoute("/_admin/admin-dashboard/")({
  component: AdminDashboard,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => {
    const page = deps.page;
    const offset = (page - 1) * PAGE_SIZE;
    return queryClient.ensureQueryData(listUsersQueryOptions(PAGE_SIZE, offset));
  },
  validateSearch: z.object({
    page: z.coerce.number().min(1).default(1),
  }),
});

function AdminDashboard() {
  const { page } = Route.useSearch();
  const offset = useMemo(() => (page - 1) * PAGE_SIZE, [page]);
  const { data } = useSuspenseQuery(listUsersQueryOptions(PAGE_SIZE, offset));
  const totalPages = useMemo(() => Math.ceil(data.total / PAGE_SIZE), [data.total]);

  // Prefetch adjacent pages to avoid pending state during navigation
  useEffect(() => {
    if (page > 1) {
      const prevOffset = (page - 2) * PAGE_SIZE;
      queryClient.prefetchQuery(listUsersQueryOptions(PAGE_SIZE, prevOffset));
    }
    if (page < totalPages) {
      const nextOffset = page * PAGE_SIZE;
      queryClient.prefetchQuery(listUsersQueryOptions(PAGE_SIZE, nextOffset));
    }
  }, [page, totalPages]);

  return (
    <>
      <h1>Admin Dashboard</h1>
      <UsersTable
        users={data.users}
        page={page}
        totalPages={totalPages}
        usersPerPage={PAGE_SIZE}
      />
    </>
  );
}
