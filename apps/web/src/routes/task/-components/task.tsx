import type { selectTasksSchema } from "@fulleststack/api/schema";

import { Link } from "@tanstack/react-router";

export default function Task({ task }: { task: selectTasksSchema }) {
  return (
    <article className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
      <h3
        className={`text-lg font-medium mb-3 text-gray-300 ${task.done ? "line-through" : ""}`}
      >
        {task.name}
      </h3>
      <div className="flex justify-end mt-2">
        <Link
          to="/task/$id"
          params={{ id: task.id.toString() }}
          role="button"
          className="px-3 py-1 border border-blue-500 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
        >
          View
        </Link>
      </div>
    </article>
  );
}
