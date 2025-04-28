# @fulleststack/eslint-config

A shared ESLint configuration package for the Fulleststack project. This package provides standardized linting rules across all applications and packages in the monorepo.

## Features

- Built on top of [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- Enforces TypeScript usage
- Includes code formatters
- Consistent styling rules (double quotes, semicolons, 2-space indentation)
- Custom rule configurations for better code quality

## Installation

This package is included in the Fulleststack monorepo and should be used as a dependency in other packages/apps.

```bash
pnpm add -D @fulleststack/eslint-config
```

## Usage

### Basic Usage

Create an `eslint.config.mjs` file in your package or application:

```js
import config from "@fulleststack/eslint-config";

export default config;
```

### Custom Configuration

For more control, use the `createConfig` export:

```js
import createConfig from "@fulleststack/eslint-config/create-config";

export default createConfig({
  // Your custom options here
  react: true, // Enable React rules
  ignores: ["dist", "node_modules"],
}, {
  // Additional rule configurations
  rules: {
    // Override or add specific rules
    "no-console": "off"
  }
});
```

## Configuration Options

The `createConfig` function accepts the following parameters:

1. `options` (optional): Configuration options for `@antfu/eslint-config`

   - Default settings include:
     - `type: "app"`
     - `typescript: true`
     - `formatters: true`
     - Stylistic preferences (2-space indentation, semicolons, double quotes)

2. `...userConfigs`: Additional ESLint configurations to be merged

## Default Rules

The package sets several opinionated rules by default:

- Enforces type definitions using `type` instead of `interface`
- Warns on `console` usage
- Disables the top-level await check
- Disables Node.js global process checks
- Errors on direct `process.env` access
- Enforces sorted imports
- Requires kebab-case for filenames (except README.md)

## Integration

This config is designed to be integrated with other packages in the Fulleststack project. It's used by:

- The root project configuration
- Web application
- API application
- API client library

## License

MIT
