import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
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
  const { View, Text } = require('react-native');
  const RealModule = jest.requireActual('react-native-paper');

  const MockCard = ({ children, style, onPress }) => <View style={style} onPress={onPress}>{children}</View>;
  MockCard.Title = ({ title, subtitle }) => (
    <View>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );
  MockCard.Content = ({ children }) => <View>{children}</View>;

  const MockRadioButton = ({ value }) => <View value={value} />;
  MockRadioButton.Group = ({ children, onValueChange, value }) => (
    <View>{children}</View>
  );

  return {
    ...RealModule,
    Card: MockCard,
    RadioButton: MockRadioButton,
  };
});