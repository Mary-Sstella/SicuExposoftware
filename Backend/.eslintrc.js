module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        'no-console': 'warn',          // avisa si usas console.log
        'no-unused-vars': 'warn',      // avisa si declaras variables sin usar
        'prettier/prettier': ['error', {
            semi: false,               // sin punto y coma
            singleQuote: true,         // comillas simples
            tabWidth: 4,               // indentación de 4 espacios
            trailingComma: 'none'      // sin coma al final
        }]
    }
}