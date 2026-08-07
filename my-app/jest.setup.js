import 'react-native-gesture-handler/jestSetup';
import '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
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
      return {
        Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
        Screen: ({ component: Component, name }) => (
          <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />
        ),
      };
    },
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const Provider = ({ children }) => <View>{children}</View>;

  const FAB = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );

  const Button = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );

  const Card = Object.assign((props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><View>{props.children}</View></TouchableOpacity>, {
    Title: (props) => (
      <View>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        {props.left && props.left()}
        {props.right && props.right()}
      </View>
    ),
    Content: (props) => <View>{props.children}</View>,
    Actions: (props) => <View>{props.children}</View>,
  });

  const RadioButtonMock = (props) => (
    <TouchableOpacity testID={props.testID} onPress={() => {}} >
      <Text>RadioButton</Text>
    </TouchableOpacity>
  );

  const RadioButtonGroup = (props) => (
    <View>{props.children}</View>
  );

  const RadioButton = Object.assign(RadioButtonMock, {
    Group: RadioButtonGroup,
  });

  return {
    Provider,
    FAB,
    Button,
    Card,
    RadioButton,
    Text,
    TextInput: (props) => <TextInput {...props} testID={props.testID} onChangeText={props.onChangeText} value={props.value} />,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
  SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));
