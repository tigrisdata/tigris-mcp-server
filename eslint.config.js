// eslint.config.js
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
    {
        ignores: ["node_modules", "dist"],
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsparser
        },
        plugins: {
            "@typescript-eslint": tseslint
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "no-console": "warn",
            "@typescript-eslint/no-unused-vars": "warn"
        },
    },
    prettier
];
