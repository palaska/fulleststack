import createConfig from "@fulleststack/eslint-config/create-config";

export default createConfig({
  react: true,
}, {
  rules: {
    "ts/no-require-imports": "off",
    "unicorn/filename-case": ["error", {
      cases: ["kebabCase", "pascalCase"],
      ignore: ["README.md", "__root.tsx"],
    }],
    "ts/no-use-before-define": "off",
    "node/no-process-env": "off",
  },
});
