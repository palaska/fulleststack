import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import RoutePending from "@/web/components/RoutePending";
import dateFormatter from "@/web/lib/date-formatter";
import { getTaskQueryOptions } from "@/web/lib/queries";
import queryClient from "@/web/lib/query-client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

export const Route = createFileRoute("/task/$id")({
  loader: ({ params }) =>
    queryClient.ensureQueryData(getTaskQueryOptions(params.id)),
  component: RouteComponent,
  pendingComponent: RoutePending,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(getTaskQueryOptions(id));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <div className="mr-4 shrink-0 self-center">
          {data.done ? <CheckIcon aria-hidden="true" className="size-16 text-green-500" /> : <XMarkIcon aria-hidden="true" className="size-16 text-red-500" />}
        </div>
        <div>
          <h4 className="text-lg font-bold">{data.name}</h4>
          <p className="mt-1">
            Updated: {dateFormatter.format(data.updatedAt)}
          </p>
          <p className="mt-1">
            Created: {dateFormatter.format(data.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex">
        <Link
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          role="button"
          to="/task/edit/$id"
          params={{ id }}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
