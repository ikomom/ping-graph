const isProductionRule = process.env.NODE_ENV === "production" ? "warn" : "off";

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "vue/multi-word-component-names": isProductionRule,
    "no-unused-vars": isProductionRule,
    "no-console": isProductionRule,
    "no-debugger": isProductionRule,
  },
};
