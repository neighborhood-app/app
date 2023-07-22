/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  runner: 'jest-serial-runner',
  testMatch: [
    '<rootDir>/src/tests/*.test.ts',
  ],
};
