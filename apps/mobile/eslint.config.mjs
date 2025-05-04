import createConfig from "@fulleststack/eslint-config/create-config";

export default createConfig({
  react: true,
}, {
  rules: {
    // Turn off no-require-imports rule
    "ts/no-require-imports": "off",
  },
});
