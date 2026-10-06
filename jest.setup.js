import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    SafeAreaView: ({ children }) => <View>{children}</View>,
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
  };
});

jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: jest.fn(() => null)
  };
});
