module.exports = {
    root: true,
    env: { browser: true, node: true, es2021: true },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
    plugins: ['@typescript-eslint'],
    rules: {
        // 例: 允许只在 ts 文件里使用 ts 规则/关闭某些冲突规则
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-unused-vars': 'off'
    }
};