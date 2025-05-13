import { patchTasksSchema } from "@fulleststack/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Button, Checkbox, Link, RoutePending } from "@/web/components";
import { deleteTask, getTaskQueryOptions, queryKeys, updateTask } from "@/web/lib/queries/tasks";
import queryClient from "@/web/lib/query-client";

export const Route = createFileRoute("/task/edit/$id")({
  loader: ({ params }) =>
    queryClient.ensureQueryData(getTaskQueryOptions(params.id)),
  component: RouteComponent,
  pendingComponent: RoutePending,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(getTaskQueryOptions(id));

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<patchTasksSchema>({
    defaultValues: data,
    resolver: zodResolver(patchTasksSchema),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.LIST_TASKS);
      navigate({ to: "/" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.LIST_TASKS.queryKey,
          ...queryKeys.LIST_TASK(id).queryKey,
        ],
      });
      navigate({ to: "/task/$id", params: { id } });
    },
  });

  const pending = deleteMutation.isPending || updateMutation.isPending;
  const error = deleteMutation.error?.message || updateMutation.error?.message;

  return (
    <form onSubmit={handleSubmit(data => updateMutation.mutate({ id, task: data }))}>
      <div className="space-y-12">
        <div className="pb-6">
          <h2 className="text-base/7 font-semibold text-gray-900">{data.name}</h2>

          <div className="mt-2">
            <fieldset>
              <div className="mt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <Checkbox aria-describedby="comments-description" {...register("done")} />
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="done" className="font-medium text-gray-900">
                      Done
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start gap-x-2">
        <Link variant="secondary-btn" to="/task/$id" params={{ id }}>Cancel</Link>
        <Button variant="danger" type="button" onClick={() => deleteMutation.mutate(id)} disabled={pending}>Delete</Button>
        <Button variant="primary" type="submit" disabled={pending || !isDirty}>Save</Button>
      </div>
    </form>
  );
}
