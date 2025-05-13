import { queryOptions } from "@tanstack/react-query";

import { authClient } from "../auth-client";

export const queryKeys = {
  LIST_USERS: ({ limit, offset }: { limit?: number; offset?: number }) => ({ queryKey: ["list-users", `limit-${limit}`, `offset-${offset}`] }),
};

export const listUsersQueryOptions = (limit?: number, offset?: number) => queryOptions({
  ...queryKeys.LIST_USERS({ limit, offset }),
  queryFn: async () => {
    const response = await authClient.admin.listUsers({ query: { limit, offset } });
    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});
