import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { RoutePending } from "@/web/components";
import { tasksQueryOptions } from "@/web/lib/queries/tasks";
import queryClient from "@/web/lib/query-client";
import TaskForm from "@/web/routes/task/-components/form";
import TaskList from "@/web/routes/task/-components/list";

export const Route = createFileRoute("/")({
  component: Index,
  loader: () => queryClient.ensureQueryData(tasksQueryOptions),
  pendingComponent: RoutePending,
});

function Index() {
  const {
    data,
  } = useSuspenseQuery(tasksQueryOptions);
  return (
    <div>
      <TaskForm />
      <TaskList tasks={data} />
    </div>
  );
}
