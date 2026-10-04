module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|uuid|react-native-safe-area-context|react-native-paper)'
  ],
  moduleNameMapper: {
    "^react-native/setup-env$": "<rootDir>/node_modules/@react-native/jest-preset/jest/setup.js"
  }
};
