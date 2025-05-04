import type { router } from "@fulleststack/api/routes";
import type { ClientRequestOptions } from "hono/client";

import { hc } from "hono/client";

// create instance to inline type in build
// https://hono.dev/docs/guides/rpc#compile-your-code-before-using-it-recommended
// eslint-disable-next-line unused-imports/no-unused-vars
const client = hc<router>("");
export type Client = typeof client;

export default (baseUrl: string, options?: ClientRequestOptions): Client => {
  const opts = {
    ...options ?? {},
    fetch: ((input, init) => {
      return fetch(input, { ...init, credentials: "include" });
    }) satisfies typeof fetch,
  };
  return hc<router>(baseUrl, opts);
};

export type ErrorSchema = {
  error: {
    issues: {
      code: string;
      path: (string | number)[];
      message?: string | undefined;
    }[];
    name: string;
  };
  success: boolean;
};
