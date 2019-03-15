module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:github/es6'
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-console': 0,
    'prefer-promise-reject-errors': 0
  }
}
