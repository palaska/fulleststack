---
description: Create a new database schema with Drizzle ORM and Zod validation
---

# Add Database Schema Command

Create a complete database schema following Drizzle ORM and Zod patterns.

## What You'll Create

For a table named `<table>`, create:

1. Schema file: `apps/api/src/db/<table>.schema.ts`
2. Export in main schema file
3. Zod validation schemas (insert and select)
4. Generate and apply migrations

## Steps

### 1. Ask for Required Information

Ask the user:
- **Table name** (e.g., "tasks", "users", "projects")
- **Fields** with types and constraints
- **Relationships** to other tables (foreign keys)

### 2. Create Schema File

File: `apps/api/src/db/<table>.schema.ts`

```typescript
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Import related schemas if needed
// import { users } from "./auth.schema";

export const <table> = sqliteTable("<table>", {
  // Primary key - auto-increment integer
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),

  // Text fields with constraints
  name: text().notNull(),
  description: text(),

  // Boolean fields
  isActive: integer({ mode: "boolean" }).notNull().default(true),

  // Foreign keys with cascade delete
  createdBy: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  // Timestamps - always include these
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Insert schema with validation
export const insert<Table>Schema = createInsertSchema(<table>, {
  // Add custom Zod validation
  name: (schema) => schema.min(1).max(500),
  description: (schema) => schema.max(2000).optional(),
})
  .required({
    // Specify required fields
    isActive: true,
  })
  .omit({
    // Remove server-managed fields
    id: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  });

// Select schema
export const select<Table>Schema = createSelectSchema(<table>);

// TypeScript types
export type Insert<Table>Schema = z.infer<typeof insert<Table>Schema>;
export type Select<Table>Schema = z.infer<typeof select<Table>Schema>;
```

### 3. Update Main Schema File

Add to `apps/api/src/db/schema.ts`:

```typescript
export * from "./<table>.schema";
```

### 4. Generate Migration

```sh
pnpm --filter api db:generate
```

This creates a migration file in `apps/api/src/db/migrations/`.

### 5. Review Migration

Open the generated migration file and verify the SQL is correct.

### 6. Apply Migration

```sh
pnpm --filter api db:push
```

This applies the migration to your Turso database.

## Common Field Patterns

### Primary Keys

```typescript
// Auto-increment integer (for business entities)
id: integer({ mode: "number" }).primaryKey({ autoIncrement: true })

// Text UUID (for distributed systems)
id: text().primaryKey().$defaultFn(() => crypto.randomUUID())
```

### Text Fields

```typescript
// Required text
name: text().notNull()

// Optional text
description: text()

// Text with length constraint (use Zod validation)
email: text().notNull() // Add .email() in Zod schema
```

### Numbers

```typescript
// Integer
count: integer({ mode: "number" }).notNull().default(0)

// Decimal (stored as text in SQLite)
price: text().notNull() // Validate as decimal in Zod
```

### Booleans

```typescript
// Boolean with default
isActive: integer({ mode: "boolean" }).notNull().default(true)
```

### Dates/Timestamps

```typescript
// Created timestamp
createdAt: integer({ mode: "timestamp" })
  .notNull()
  .$defaultFn(() => new Date())

// Updated timestamp (auto-updates)
updatedAt: integer({ mode: "timestamp" })
  .notNull()
  .$defaultFn(() => new Date())
  .$onUpdate(() => new Date())

// Optional date
dueDate: integer({ mode: "timestamp" })
```

### Foreign Keys

```typescript
// With cascade delete
userId: text()
  .references(() => users.id, { onDelete: "cascade" })
  .notNull()

// Optional foreign key
assignedTo: text()
  .references(() => users.id, { onDelete: "set null" })
```

### Enums (as text)

```typescript
// Store as text, validate with Zod
status: text().notNull().default("pending")

// In Zod schema:
status: z.enum(["pending", "active", "completed"]).default("pending")
```

## Zod Validation Patterns

### String Validation

```typescript
createInsertSchema(table, {
  name: (schema) => schema.min(1).max(500),
  email: (schema) => schema.email(),
  url: (schema) => schema.url(),
  slug: (schema) => schema.regex(/^[a-z0-9-]+$/),
})
```

### Number Validation

```typescript
createInsertSchema(table, {
  age: (schema) => schema.min(0).max(150),
  price: (schema) => schema.regex(/^\d+\.\d{2}$/), // For text decimals
  rating: (schema) => schema.min(1).max(5),
})
```

### Custom Validation

```typescript
createInsertSchema(table, {
  password: (schema) =>
    schema.min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
})
```

## Important Reminders

- **Use snake_case for column names**: Drizzle config has `casing: "snake_case"`
- **Always include timestamps**: createdAt and updatedAt
- **Foreign keys with cascade**: Specify onDelete behavior
- **Omit server-managed fields**: id, createdBy, timestamps from insert schema
- **Never edit migrations**: Generate new ones for changes
- **Never edit auth.schema.ts**: It's generated by Better Auth CLI

## Next Steps

Tell the user:
1. Schema created successfully
2. Migration generated and applied
3. Use the insert/select schemas in API routes
4. Consider adding indexes for frequently queried fields
5. Update API routes to use the new schemas
