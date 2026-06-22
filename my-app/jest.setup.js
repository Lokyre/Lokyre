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
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    }
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
    Ionicons: () => <View />
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  const RealPaper = jest.requireActual('react-native-paper');

  const MockCardContent = ({ children }) => <View>{children}</View>;

  const MockCard = ({ children, onPress, testID, style }) => (
    <TouchableOpacity onPress={onPress} testID={testID} style={style}>
      {children}
    </TouchableOpacity>
  );
  MockCard.Content = MockCardContent;
  MockCard.Title = RealPaper.Card.Title;
  MockCard.Actions = RealPaper.Card.Actions;

  return {
    ...RealPaper,
    Card: MockCard,
    TextInput: (props) => <TextInput {...props} />,
  };
});
