import createConfig from "@fulleststack/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default createConfig({
  react: true,
}, {
  plugins: {
    "@tanstack/query": pluginQuery,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "antfu/top-level-function": "off",
    "@tanstack/query/exhaustive-deps": "error",
    "unicorn/filename-case": ["error", {
      cases: {
        kebabCase: true,
        pascalCase: true,
      },
      ignore: ["README.md", "__root.tsx"],
    }],
  },
});
