export default {
  testEnvironment: 'jsdom',
  preset: "ts-jest",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(tsx?|jsx?)$': 'babel-jest',
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  }

};
