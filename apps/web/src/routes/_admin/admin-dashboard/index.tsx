import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { listUsersQueryOptions } from "@/web/lib/queries/admin";
import queryClient from "@/web/lib/query-client";

import { UsersTable } from "./-components/UsersTable";
import { useMemo } from "react";
import { z } from "zod";

const PAGE_SIZE = 5;

export const Route = createFileRoute("/_admin/admin-dashboard/")({
  component: AdminDashboard,
  loader: () => queryClient.ensureQueryData(listUsersQueryOptions(PAGE_SIZE, 0)),
  validateSearch: z.object({
    page: z.coerce.number().min(1).default(1),
  }),
});

function AdminDashboard() {
  const { page } = Route.useSearch();
  const offset = useMemo(() => (page - 1) * PAGE_SIZE, [page]);
  const {
    data,
    // isLoading,
  } = useSuspenseQuery(listUsersQueryOptions(PAGE_SIZE, offset));
  const totalPages = useMemo(() => Math.ceil(data.total / PAGE_SIZE), [data.total]);

  return (
    <UsersTable users={data.users} page={page} totalPages={totalPages} usersPerPage={PAGE_SIZE} />
  );
}
