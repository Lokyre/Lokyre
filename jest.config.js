module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    "^react-native/setup-env$": "<rootDir>/node_modules/@react-native/jest-preset/jest/setup.js"
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-native-safe-area-context|@expo/vector-icons|react-native-paper|uuid)/'
  ],
};
