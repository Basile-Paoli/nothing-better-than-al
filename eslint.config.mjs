import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config({
	files: ['src/**/*.ts'],
	extends: [
		eslint.configs.recommended,
		tseslint.configs.recommended,
	],
	plugins: {
		'unused-imports': unusedImports
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', {ignoreRestSiblings: true}],
		'unused-imports/no-unused-imports': 'error',
	},
})