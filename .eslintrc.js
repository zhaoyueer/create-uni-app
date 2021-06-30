module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-var': 2,
    'no-empty': 0,
  },
};
