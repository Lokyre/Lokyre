import '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    },
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
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
  const RealPaper = jest.requireActual('react-native-paper');

  const MockedCard = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockedCard.Content = ({ children }) => <View>{children}</View>;
  MockedCard.Title = RealPaper.Card.Title;
  MockedCard.Actions = ({ children }) => <View>{children}</View>;

  const MockedRadioButton = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockedRadioButton.Group = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockedRadioButton.Item = RealPaper.RadioButton.Item;

  return {
    ...RealPaper,
    Card: MockedCard,
    RadioButton: MockedRadioButton,
  };
});
