module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/recommended',
    'standard'],
  plugins: [
    'html',
    'promise',
  ],
  globals: {
  },
  'rules': {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': [
      process.env.NODE_ENV === 'production' ? 2 : 0,
      {
        allow: ['warn', 'error']
      }
    ]
  }
}
