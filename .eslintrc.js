module.exports = {
    'env': {
        'es2020': true,
        'node': true,
        'mocha': true,
    },
    'extends': ['eslint:recommended', 'google'],
    'parserOptions': {
        'ecmaVersion': 11,
        'sourceType': 'module',
    },
    'rules': {
        'no-unused-vars': 'off',
        'no-invalid-this': 'off',
        'indent': ['error', 4],
        'max-len': ['error', {'code': 120}],
    },
};
