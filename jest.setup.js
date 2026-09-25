import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify([]))),
  setItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => <View>{children}</View>),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
    Ionicons: (props) => <Text {...props}>{props.name}</Text>,
  };
});

// Mock FAB and IconButton for React Native Paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  const ActualPaper = jest.requireActual('react-native-paper');

  return {
    ...ActualPaper,
    FAB: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>FAB</Text>
      </TouchableOpacity>
    ),
    IconButton: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>IconButton</Text>
      </TouchableOpacity>
    ),
  };
});
