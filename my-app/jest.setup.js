import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

jest.mock('react-native-get-random-values', () => ({}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <View {...props} testID="mock-icon" />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => <View {...props} testID="mock-icon" />,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput, FlatList } = require('react-native');
  const ActualPaper = jest.requireActual('react-native-paper');

  const Card = ({ children, style, onPress, testID }) => (
    <TouchableOpacity onPress={onPress} testID={testID} style={style}>
      {children}
    </TouchableOpacity>
  );
  Card.Title = ({ title, subtitle, right }) => (
    <View>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
      {right && right({})}
    </View>
  );
  Card.Content = ({ children }) => <View>{children}</View>;

  return {
    ...ActualPaper,
    Card,
    FAB: (props) => <TouchableOpacity {...props}><Text>FAB</Text></TouchableOpacity>,
    IconButton: (props) => <TouchableOpacity {...props}><Text>Icon</Text></TouchableOpacity>,
    ActivityIndicator: (props) => <View testID="activity-indicator" {...props} />,
    TextInput: (props) => <RNTextInput {...props} />,
    Button: (props) => <TouchableOpacity {...props}><Text>{props.children}</Text></TouchableOpacity>,
    RadioButton: {
      Group: ({ children, onValueChange, value }) => {
        // Simple mock allowing nested items to render
        return <View testID="radio-group">{children}</View>;
      },
      Item: (props) => <TouchableOpacity {...props}><Text>{props.label}</Text></TouchableOpacity>,
    }
  };
});

// Mock alert
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert').mockImplementation(() => {});