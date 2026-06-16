import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
    useSafeAreaInsets: jest.fn().mockReturnValue(inset),
    useSafeAreaFrame: jest.fn().mockReturnValue({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View } = require('react-native');
  const RealModule = jest.requireActual('react-native-paper');
  return {
    ...RealModule,
    Card: {
      ...RealModule.Card,
      Content: ({ children }) => <View>{children}</View>,
    },
    RadioButton: {
      ...RealModule.RadioButton,
      Group: ({ children }) => <View>{children}</View>,
    },
  };
});
