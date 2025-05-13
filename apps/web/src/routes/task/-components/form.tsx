import { insertTasksSchema } from "@fulleststack/api/schema";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Button, ErrorMessage, Field, Label, Textarea } from "@/web/components";
import { createTask, queryKeys } from "@/web/lib/queries/tasks";

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
      <Field>
        <Label>Task</Label>
        <Textarea
          className="block w-full"
          {...register("name")}
          disabled={createMutation.isPending}
          defaultValue=""
          rows={2}
        />
        <ErrorMessage>{errors?.name?.message ?? <>&nbsp;</>}</ErrorMessage>
      </Field>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={createMutation.isPending}>Create Task</Button>
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
