module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-paper|react-native-safe-area-context|@expo/vector-icons|uuid|react-native-get-random-values|react-native-screens)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  clearMocks: true,
};
