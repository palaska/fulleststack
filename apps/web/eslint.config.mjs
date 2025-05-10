import createConfig from "@fulleststack/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default createConfig({
  react: true,
}, {
  plugins: {
    "@tanstack/query": pluginQuery,
  },
  rules: {
    "antfu/top-level-function": "off",
    "@tanstack/query/exhaustive-deps": "error",
    "unicorn/filename-case": ["error", {
      cases: ["kebabCase", "pascalCase"],
      ignore: ["README.md", "__root.tsx"],
    }],
  },
});
