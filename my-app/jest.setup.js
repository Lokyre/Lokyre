import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
    useRoute: jest.fn(() => ({ params: {} })),
    NavigationContainer: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => {
      const React = require('react');
      const { View } = require('react-native');
      const Navigator = ({ children }) => <View>{React.Children.toArray(children)}</View>;
      const Screen = ({ component: Component }) => (
        <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />
      );
      return { Navigator, Screen };
    }
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => { const { View } = require('react-native'); return <View>{children}</View>; },
  SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const CardMock = ({ children, style, ...props }) => <TouchableOpacity {...props}>{children}</TouchableOpacity>;
  CardMock.Title = ({ title, subtitle }) => (
    <View>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );
  CardMock.Content = ({ children }) => <View>{children}</View>;
  CardMock.Actions = ({ children }) => <View>{children}</View>;

  const RadioButtonGroupMock = ({ children, onValueChange, value }) => <View>{children}</View>;
  RadioButtonGroupMock.Item = ({ label, value }) => <Text>{label}</Text>;

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    Card: CardMock,
    Title: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    Text: ({ children }) => <Text>{children}</Text>,
    Button: ({ children, onPress, ...props }) => <TouchableOpacity onPress={onPress} {...props}><Text>{children}</Text></TouchableOpacity>,
    TextInput: (props) => <TextInput {...props} />,
    RadioButton: { Group: RadioButtonGroupMock, Item: RadioButtonGroupMock.Item },
    FAB: ({ onPress, testID }) => <TouchableOpacity onPress={onPress} testID={testID}><Text>FAB</Text></TouchableOpacity>,
    ActivityIndicator: () => <Text>Loading...</Text>
  };
});

jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});
