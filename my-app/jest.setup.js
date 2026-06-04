import '@testing-library/react-native';

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
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    useSafeAreaFrame: jest.fn().mockImplementation(() => ({ x: 0, y: 0, width: 390, height: 844 })),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
    FontAwesome: () => <View />,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View } = require('react-native');
  const ActualPaper = jest.requireActual('react-native-paper');

  return {
    ...ActualPaper,
    Card: Object.assign(
      ({ children }) => <View>{children}</View>,
      {
        Content: ({ children }) => <View>{children}</View>,
        Title: ({ title, subtitle }) => <View>{title}{subtitle}</View>,
        Actions: ({ children }) => <View>{children}</View>,
        Cover: () => <View />
      }
    ),
    RadioButton: Object.assign(
      ({ value }) => <View testID={`radio-${value}`} />,
      {
        Group: ({ children }) => <View>{children}</View>,
        Item: ({ label, value }) => <View testID={`radio-item-${value}`}>{label}</View>
      }
    )
  };
});
