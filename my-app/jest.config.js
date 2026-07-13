module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['@testing-library/react-native', '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-paper|react-native-safe-area-context|@expo/vector-icons|uuid)'
  ],
  clearMocks: true,
};
