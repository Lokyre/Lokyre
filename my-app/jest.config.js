module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-native', '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-safe-area-context|react-native-paper|uuid)'
  ],
  testEnvironment: 'node'
};