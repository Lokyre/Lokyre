import React from 'react';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => (
        <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
      ),
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const Card = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      {props.children}
    </TouchableOpacity>
  );
  Card.Title = (props) => (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.right && props.right()}
    </View>
  );
  Card.Content = (props) => <View>{props.children}</View>;
  Card.Actions = (props) => <View>{props.children}</View>;

  const FAB = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );

  const Button = (props) => (
    <TouchableOpacity onPress={props.onPress} testID={props.testID}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );

  const RadioButtonGroup = (props) => (
    <View>
      {React.Children.map(props.children, (child) =>
        React.cloneElement(child, {
          onValueChange: props.onValueChange,
          selectedValue: props.value,
        })
      )}
    </View>
  );
  const RadioButtonItem = (props) => (
    <TouchableOpacity onPress={() => props.onValueChange(props.value)}>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );

  const PaperProvider = ({ children }) => <View>{children}</View>;

  return {
    Text: ({ children }) => <Text>{children}</Text>,
    TextInput: (props) => <TextInput {...props} />,
    Card,
    FAB,
    Chip: ({ children }) => <Text>{children}</Text>,
    Button,
    RadioButton: Object.assign((props) => <View {...props} />, {
      Group: RadioButtonGroup,
      Item: RadioButtonItem,
    }),
    Divider: () => <View />,
    PaperProvider,
  };
});
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => ({
  StatusBar: jest.fn(),
}));


jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: jest.fn(() => null),
  };
});
