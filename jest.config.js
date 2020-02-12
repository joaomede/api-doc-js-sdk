module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsConfig: 'tsconfig.json'
    }
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  coveragePathIgnorePatterns: [
    '<rootDir>/test/helpers/',
    '<rootDir>/node_modules/'
  ],
  collectCoverage: true,
  clearMocks: true,
  preset: 'ts-jest'
}
