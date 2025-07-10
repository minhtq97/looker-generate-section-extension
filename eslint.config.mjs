import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    {
        files: ["**/*.{js,mjs,ts,tsx}"],
        ignores: ["webpack*.js", "analyze-bundle.js"],
        extends: compat.extends(
            "plugin:react/recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:prettier/recommended",
        ),

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2018,
            sourceType: "module",
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {},
    },
    {
        files: ["webpack*.js", "analyze-bundle.js"],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "commonjs",
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
]);