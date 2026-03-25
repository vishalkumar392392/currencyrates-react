module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^styled-components$': '<rootDir>/src/__mocks__/styled-components.js',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx'],
};
