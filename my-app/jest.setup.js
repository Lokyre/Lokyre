import '@testing-library/react-native';
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
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    }
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  const RealModule = jest.requireActual('react-native-paper');

  const MockCardContent = ({ children, testID }) => <View testID={testID}>{children}</View>;
  const MockCardTitle = ({ title, subtitle, testID }) => (
    <View testID={testID}>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );

  const MockCard = ({ children, testID, ...props }) => <View testID={testID} {...props}>{children}</View>;
  MockCard.Content = MockCardContent;
  MockCard.Title = MockCardTitle;
  MockCard.Actions = ({ children }) => <View>{children}</View>;

  const MockRadioButtonGroup = ({ children, onValueChange, value }) => (
    <View>{children}</View>
  );
  MockRadioButtonGroup.Item = ({ label, value }) => <View />;
  const MockRadioButton = {
    Group: MockRadioButtonGroup,
    Item: MockRadioButtonGroup.Item
  };

  return {
    ...RealModule,
    Card: MockCard,
    RadioButton: MockRadioButton,
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
    FontAwesome: () => <View />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View />;
});
