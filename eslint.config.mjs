import react from "@eslint-react/eslint-plugin";
import reactCompiler from "eslint-plugin-react-compiler";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  react.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      react,
      reactCompiler,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/prop-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["node_modules/**/*", "dist/**/*"],
  },
);
