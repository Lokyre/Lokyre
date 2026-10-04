import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve(null)),
  clear: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 })
    },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 }))
  };
});
