// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: 'jest-puppeteer',

  testMatch: ['**/?(*.)+(spec|test).js?(x)'],

  testPathIgnorePatterns: ['/node_modules/'],

  testTimeout: 200000
}
