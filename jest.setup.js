import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(JSON.stringify([])),
  setItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
  };
});

jest.mock('react-native-paper/src/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return (props) => <Text>{props.name}</Text>;
});
