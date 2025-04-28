# Hono + React / Vite + Cloudflare + pnpm workspaces monorepo

A monorepo setup using pnpm workspaces with a Hono API and React / vite client deployed to Cloudflare Workers / Static Assets / Turso.

Features:

- Run tasks in parallel across apps / packages with pnpm
- Hono API [proxied with vite](./apps/web/vite.config.ts) during development
- Hono [RPC client](packages/api-client/src/index.ts) built during development for faster inference
- Shared Zod validators with drizzle-zod
- Shared eslint config
- Shared tsconfig

Tech Stack:

- api
  - hono
  - hono openapi
  - better-auth
  - stoker
  - drizzle
  - drizzle-zod
  - turso
- web
  - react
  - vite
  - react-hook-form
  - tanstack router
- dev tooling
  - typescript
  - eslint with `@antfu/eslint-config`

Tour:

- Base [tsconfig.json](./tsconfig.json) with default settings lives in the root
- Shared packages live in [/packages] directory
  - Base [eslint.config.js](./packages/eslint-config/eslint.config.js) with default settings
- Applications live in [/apps] directory
  - Use any cli to create new apps in here
  - If cloning a git repo in here be sure to delete the `.git` folder so it is not treated as a submodule

> All pnpm commands are run from the root of the repo.

## Local Setup

### Install dependencies

```sh
pnpm i
```

### Configure Turso Database

Create a `.dev.vars` file in the `apps/api` directory using the example file as a template:

```sh
cp apps/api/.dev.vars.example apps/api/.dev.vars
```

Update the values in the `.dev.vars` file with your Turso credentials.

### Run DB migrations locally

```sh
pnpm run -r db:push
```

### Start Apps

```sh
pnpm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

All requests to `/api` will be proxied to the hono server running on [http://localhost:8787](http://localhost:8787)

## Production Setup

### Run DB migrations on Turso

```sh
pnpm run -r db:push
```

### Deploy

```sh
pnpm run deploy
```

## Tasks

### Lint

```sh
pnpm run lint
```

### Test

```sh
pnpm run test
```

### Build

```sh
pnpm run build
```
