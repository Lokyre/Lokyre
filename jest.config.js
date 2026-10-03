module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: { "^react-native/setup-env$": "<rootDir>/node_modules/@react-native/jest-preset/jest/setup.js" },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-safe-area-context|uuid)'
  ],
};
