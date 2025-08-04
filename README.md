# Hono + React / Vite + Cloudflare + pnpm workspaces monorepo

A monorepo setup using pnpm workspaces with a Hono API and React / vite client deployed as a NodeJS server.

Features:

- Run tasks in parallel across apps / packages with pnpm
- Hono API [proxied with vite](./apps/web/vite.config.ts) during development
- Hono [RPC client](packages/api-client/src/index.ts) built during development for faster inference
- Shared Zod validators with drizzle-zod
- Authentication handled by `better-auth` (email/password, OAuth providers)
- Shared eslint config using `@antfu/eslint-config`
- Shared tsconfig
- Shared UI components in `packages/ui`
- Expo mobile application with NativeWind (Tailwind CSS for React Native)

Tech Stack:

- api (`apps/api`)
  - hono
  - hono openapi
  - better-auth
  - stoker
  - drizzle
  - drizzle-zod
  - turso
- web (`apps/web`)
  - react
  - vite
  - react-hook-form
  - tanstack router
  - tanstack query
  - `better-auth` client for web authentication
- mobile (`apps/mobile`)
  - react-native
  - expo
  - expo router
  - nativewind
  - `@better-auth/expo` for native authentication
- dev tooling
  - typescript
  - eslint with `@antfu/eslint-config`
  - turbo
  - syncpack

Tour:

- Base [tsconfig.json](./tsconfig.json) with default settings lives in the root
- Shared packages live in [/packages] directory
  - `api-client`: Hono RPC client for type-safe API communication.
  - `common`: Shared utilities and types.
  - `eslint-config`: Shared ESLint configuration based on `@antfu/eslint-config`.
  - `ui`: Shared React UI components.
- Base [eslint.config.js](./packages/eslint-config/eslint.config.js) with default settings
- Applications live in [/apps] directory
  - `api`: Hono backend application deployed as a NodeJS server, using Drizzle ORM with Turso.
    - Features `better-auth` for authentication, configured in `src/lib/auth.ts`. Auth-related database schema is generated via `pnpm --filter api generate-auth-schema`.
  - `db`: Contains a local Turso development database setup and data.
  - `mobile`: Expo (React Native) mobile application.
    - Uses `@better-auth/expo` for native authentication flows, integrating with the API's `better-auth` setup.
  - `web`: React/Vite frontend application.
    - Integrates with `better-auth` for authentication, complementing the API setup.

> All pnpm commands are run from the root of the repo.

## Local Setup

### Install dependencies

```sh
pnpm i
```

### Configure Turso Database

Create a `.env` file in the `apps/api` directory using the example file as a template:

```sh
cp apps/api/.env.example apps/api/.env
```

Update the values in the `.env` file with your Turso credentials.

### Run DB migrations locally

This command applies migrations to your local Turso database if you are using `turso dev` or a local libSQL file.
If you are using a remote Turso dev database, configure `apps/api/drizzle.config.ts` accordingly or use the production migration command.

```sh
pnpm --filter api db:push
```

### Start Apps

```sh
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173)

All requests to `/api` will be proxied to the hono server running on [http://localhost:8787](http://localhost:8787)

## Production Setup

### Run DB migrations on Turso

This command applies migrations to your production Turso database. Ensure `apps/api/drizzle.config.ts` is configured for your production database.

```sh
pnpm --filter api db:push
```

### Deploy

```sh
pnpm run deploy
```

## Tasks

### Lint

```sh
pnpm lint
```

### Test

```sh
pnpm test
```

### Build

```sh
pnpm build
```
