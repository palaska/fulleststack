---
description: Scaffold a new API route with all required files (routes, handlers, tests)
---

# Add API Route Command

Create a complete API route following the established pattern.

## What You'll Create

For a route named `<name>`, create these files in `apps/api/src/routes/<name>/`:

1. `<name>.index.ts` - Route registration
2. `<name>.routes.ts` - OpenAPI route definitions
3. `<name>.handlers.ts` - Handler implementations
4. `<name>.test.ts` - Vitest tests

## Steps

### 1. Ask for Required Information

Ask the user:
- **Route name** (e.g., "tasks", "users", "projects")
- **Base path** (e.g., "/tasks", "/api/v1/users")
- **Initial operations** to create (e.g., "list, create, get by ID, update, delete")

### 2. Create Directory

```sh
mkdir -p apps/api/src/routes/<name>
```

### 3. Create Route Registration File

File: `apps/api/src/routes/<name>/<name>.index.ts`

```typescript
import { createRouter } from "@/api/lib/create-router";
import * as handlers from "./<name>.handlers";
import * as routes from "./<name>.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create);
  // Add more routes as needed

export default router;
```

### 4. Create Routes File with OpenAPI Specs

File: `apps/api/src/routes/<name>/<name>.routes.ts`

```typescript
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import * as HttpStatusCodes from "stoker/http-status-codes";

// Import your schemas here
// import { selectSchema, insertSchema } from "@/api/db/<name>.schema";

export const list = createRoute({
  method: "get",
  path: "/<path>",
  tags: ["<name>"],
  summary: "Get all <name>",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.array(z.object({
            // Define response schema
          })),
        },
      },
      description: "List of <name>",
    },
  },
});

export const create = createRoute({
  method: "post",
  path: "/<path>",
  tags: ["<name>"],
  summary: "Create new <name>",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            // Define request schema
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      content: {
        "application/json": {
          schema: z.object({
            // Define response schema
          }),
        },
      },
      description: "Created <name>",
    },
  },
});
```

### 5. Create Handlers File

File: `apps/api/src/routes/<name>/<name>.handlers.ts`

```typescript
import type { AppRouteHandler } from "@/api/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type * as routes from "./<name>.routes";

export const list: AppRouteHandler<typeof routes.list> = async (c) => {
  const db = c.get("db");

  // TODO: Implement list logic
  const items = []; // await db.select().from(table);

  return c.json(items, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<typeof routes.create> = async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");

  // TODO: Implement create logic
  const item = {}; // await db.insert(table).values(body);

  return c.json(item, HttpStatusCodes.CREATED);
};
```

### 6. Create Test File

File: `apps/api/src/routes/<name>/<name>.test.ts`

```typescript
import { describe, expect, it } from "vitest";
import { createTestApp } from "@/api/lib/create-app";
import router from "./<name>.index";

describe("<name> API", () => {
  const app = createTestApp(router);

  describe("GET /<path>", () => {
    it("should return list of <name>", async () => {
      const response = await app.request("/<path>");

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("POST /<path>", () => {
    it("should create new <name>", async () => {
      const testData = {
        // Add test data
      };

      const response = await app.request("/<path>", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      // Add assertions
    });
  });
});
```

### 7. Register Route in Main Router

Update `apps/api/src/routes/index.ts`:

```typescript
import <name> from "./<name>/<name>.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/", <name>); // Add this line
}
```

### 8. Verify

```sh
pnpm --filter api typecheck  # Check for type errors
pnpm --filter api test       # Run tests
pnpm --filter api dev        # Start dev server to test
```

## Next Steps

Tell the user:
1. Files created successfully
2. Review TODOs in handlers and routes files
3. Add database schema if needed (use `/add-db-schema` command)
4. Implement actual business logic
5. Add more routes as needed
6. Run tests and type check
