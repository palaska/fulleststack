import RoutePending from "@/web/components/RoutePending";
import { deleteTask, getTaskQueryOptions, queryKeys, updateTask } from "@/web/lib/queries";
import queryClient from "@/web/lib/query-client";
import { patchTasksSchema } from "@fulleststack/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

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
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">{data.name}</h2>

          <div className="mt-2">
            <fieldset>
              <div className="mt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        {...register("done")}
                        type="checkbox"
                        aria-describedby="comments-description"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
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

      <div className="flex items-center justify-start gap-x-6">
        <button
          type="button"
          disabled={pending}
          className="text-sm/6 font-semibold text-gray-900"
          onClick={() => navigate({ to: "/task/$id", params: { id } })}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={() => deleteMutation.mutate(id)}
          disabled={pending}
        >
          Delete
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={pending || !isDirty}
        >
          Save
        </button>
      </div>
    </form>
  );
}
