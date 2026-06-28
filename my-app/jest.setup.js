import 'react-native-gesture-handler/jestSetup';
import '@testing-library/react-native';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});

// Mock react-native-paper icons
jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View />;
});
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
  };
});

// Mock React Native Paper specific parts
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput } = require('react-native');
  const RealModule = jest.requireActual('react-native-paper');

  return {
    ...RealModule,
    Card: Object.assign(
      ({ children, testID, onPress }) => (
        <TouchableOpacity testID={testID} onPress={onPress}>
          {children}
        </TouchableOpacity>
      ),
      {
        Title: ({ title, subtitle }) => (
          <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
          </View>
        ),
        Content: ({ children }) => <View>{children}</View>,
        Actions: ({ children }) => <View>{children}</View>,
      }
    ),
    RadioButton: Object.assign(
      ({ value, testID }) => <View testID={testID}>{value}</View>,
      {
        Group: ({ children, onValueChange, value }) => <View>{children}</View>,
      }
    ),
  };
});
