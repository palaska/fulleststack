import { insertTasksSchema } from "@fulleststack/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { createTask, queryKeys } from "@/web/lib/queries";
import { XCircleIcon } from "@heroicons/react/24/outline";

export default function TaskForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<insertTasksSchema>({
    defaultValues: {
      name: "",
      done: false,
    },
    resolver: zodResolver(insertTasksSchema),
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(queryKeys.LIST_TASKS);
    },
    onSettled: () => {
      setTimeout(() => {
        setFocus("name");
      });
    },
  });

  return (
    <form onSubmit={handleSubmit(data => createMutation.mutate(data))}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-2">
          <h2 className="text-base/7 font-semibold text-gray-900">Enter a task</h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <div className="mt-2">
                <textarea
                  {...register("name")}
                  disabled={createMutation.isPending}
                  rows={2}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={''}
                />
              </div>
              {errors.name?.message && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>

      {createMutation.error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
            <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{createMutation.error.message}</h3>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
