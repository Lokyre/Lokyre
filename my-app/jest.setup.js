import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

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

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const Provider = ({ children }) => <View>{children}</View>;
  const Button = ({ children, onPress, testID }) => <TouchableOpacity onPress={onPress} testID={testID}><Text>{children}</Text></TouchableOpacity>;
  const Card = Object.assign(({ children, testID, onPress }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <View>{children}</View>
    </TouchableOpacity>
  ), {
    Title: ({ title, subtitle, right, left }) => (
      <View>
        {left && left()}
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        {right && right()}
      </View>
    ),
    Content: ({ children }) => <View>{children}</View>,
    Actions: ({ children }) => <View>{children}</View>,
  });
  const Title = ({ children }) => <Text>{children}</Text>;
  const Paragraph = ({ children }) => <Text>{children}</Text>;
  const FAB = ({ onPress, testID }) => <TouchableOpacity onPress={onPress} testID={testID || 'fab'}><Text>FAB</Text></TouchableOpacity>;
  const TextInputMock = ({ value, onChangeText, testID, label }) => <TextInput value={value} onChangeText={onChangeText} testID={testID} placeholder={label} />;
  const IconButton = ({ onPress, testID }) => <TouchableOpacity onPress={onPress} testID={testID}><Text>IconButton</Text></TouchableOpacity>;

  const RadioButton = Object.assign(({ value, onPress }) => <TouchableOpacity onPress={onPress}><Text>{value}</Text></TouchableOpacity>, {
    Group: ({ onValueChange, value, children }) => <View>{children}</View>,
    Item: ({ label, value }) => <Text>{label}</Text>
  });

  const ActivityIndicator = () => <View testID="activity-indicator" />;

  return {
    Provider,
    Button,
    Card,
    Title,
    Paragraph,
    FAB,
    TextInput: TextInputMock,
    IconButton,
    RadioButton,
    ActivityIndicator,
    Text: ({ children, style }) => <Text style={style}>{children}</Text>,
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    NavigationContainer: ({ children }) => <>{children}</>,
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />,
    }),
  };
});
