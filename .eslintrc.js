module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: false }]
  }
};
