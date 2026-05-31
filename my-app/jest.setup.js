import 'react-native-gesture-handler/jestSetup';
const { View } = require('react-native');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const actualPaper = jest.requireActual('react-native-paper');
  const View = require('react-native').View;

  return {
    ...actualPaper,
    Card: Object.assign(({ children, ...props }) => <View {...props}>{children}</View>, {
      Content: ({ children, ...props }) => <View {...props}>{children}</View>,
      Actions: ({ children, ...props }) => <View {...props}>{children}</View>,
      Title: ({ children, ...props }) => <View {...props}>{children}</View>,
      Cover: ({ children, ...props }) => <View {...props}>{children}</View>,
    }),
    RadioButton: Object.assign(({ children, ...props }) => <View {...props}>{children}</View>, {
      Group: ({ children, ...props }) => <View {...props}>{children}</View>,
    }),
    FAB: ({ children, ...props }) => <View testID="fab" {...props}>{children}</View>,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const View = require('react-native').View;
  return ({ children }) => <View>{children}</View>;
});

jest.mock('@expo/vector-icons', () => {
  const View = require('react-native').View;
  return {
    Ionicons: ({ children }) => <View>{children}</View>,
    MaterialCommunityIcons: ({ children }) => <View>{children}</View>,
  };
});

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'mock-uuid-v4')
  };
});

jest.mock('react-native-get-random-values', () => ({}));
