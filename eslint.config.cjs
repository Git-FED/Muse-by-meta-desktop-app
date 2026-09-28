module.exports = [
  { ignores: ["src/renderer/renderer.ts"] },
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];
