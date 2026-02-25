// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import pluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/**
 * Defines workspace linting configuration by extending base defaults and assigning quality rules for the review workflow.
 * Processes linting configuration with rules and formatting to maintain consistent source quality within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export default defineConfig([
	// Excludes build output and tooling folders from lint passes to save time
	{ ignores: ['dist', '.angular', 'node_modules', 'coverage'] },

	// Groups strict parsing rules alongside formatting standards for codebase
	{
		files: ['**/*.ts'],
		processor: angular.processInlineTemplates,
		plugins: { jsdoc: jsdoc, import: pluginImport },
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.stylistic,
			...tseslint.configs.recommended,
			...angular.configs.tsRecommended
		],
		rules: {
			// Angular selector rules permit prefixes and enforce strict casing format
			'@angular-eslint/directive-selector': [
				'error',
				{
					prefix: [],
					type: 'attribute',
					style: 'camelCase'
				}
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					prefix: [],
					type: 'element',
					style: 'kebab-case'
				}
			],

			// Angular quality rules lower risk patterns and encourage stable codebase
			'@angular-eslint/no-input-rename': 'off',
			'@angular-eslint/use-lifecycle-interface': 'error',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'warn',

			// TypeScript rules favor strict typing and clean imports for safer builds
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'@typescript-eslint/no-explicit-any': [
				'error',
				{ fixToUnknown: true, ignoreRestArgs: false }
			],

			// JavaScript rules limit noise and enforce rigid spacing for clear output
			curly: 'off',
			'no-unused-vars': 'off',
			'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
			'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
			'spaced-comment': ['error', 'always', { markers: ['/'], block: { balanced: true } }],

			// Import order groups paths keeping stable alphabet list for rapid search
			'import/prefer-default-export': 'off',

			// JSDoc rules enforce tags alignment and maintain block indentation depth
			'jsdoc/check-alignment': 'warn',
			'jsdoc/check-indentation': 'warn',
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-returns-type': 'off'
		}
	},

	// Enables console restrictions exclusively for the dedicated service file
	{
		files: ['**/services/logger.ts'],
		rules: {
			'no-console': [
				'warn',
				{
					allow: [
						'log',
						'info',
						'warn',
						'debug',
						'error',
						'group',
						'groupEnd',
						'groupCollapsed'
					]
				}
			]
		}
	},

	// Scans HTML files with template quality guards and strict equality check
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		rules: {
			'@angular-eslint/template/eqeqeq': 'error',
			'@angular-eslint/template/no-any': 'warn'
		}
	},

	// Prettier hook applies formatting rules and parses external style config
	eslintPluginPrettierRecommended
]);
