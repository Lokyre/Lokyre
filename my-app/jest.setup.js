import 'react-native-gesture-handler/jestSetup';
import { Alert } from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
  };
});

// Mock React Navigation stack
jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => (
        <Component
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }}
          route={{ params: {} }}
        />
      ),
    }),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }),
    },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

// Mock react-native-paper components to avoid test rendering errors
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const CardMock = Object.assign(
    (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    ),
    {
      Title: (props) => (
        <View testID={props.testID}>
          {props.title && <Text>{props.title}</Text>}
          {props.subtitle && <Text>{props.subtitle}</Text>}
          {props.left && props.left()}
          {props.right && props.right()}
        </View>
      ),
      Content: (props) => <View {...props} />,
      Actions: (props) => <View {...props} />,
    }
  );

  const RadioButtonMock = Object.assign(
    (props) => (
      <TouchableOpacity testID={props.testID} onPress={() => props.onPress && props.onPress(props.value)}>
        <Text>{props.value}</Text>
      </TouchableOpacity>
    ),
    {
      Group: (props) => <View {...props}>{props.children}</View>,
      Item: (props) => (
        <TouchableOpacity testID={props.testID} onPress={() => props.onPress && props.onPress(props.value)}>
          <Text>{props.label}</Text>
        </TouchableOpacity>
      ),
    }
  );

  return {
    Card: CardMock,
    Title: (props) => <Text {...props}>{props.children}</Text>,
    Paragraph: (props) => <Text {...props}>{props.children}</Text>,
    Text: (props) => <Text {...props}>{props.children}</Text>,
    TextInput: (props) => <TextInput {...props} />,
    Button: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.children}</Text>
      </TouchableOpacity>
    ),
    IconButton: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.icon}</Text>
      </TouchableOpacity>
    ),
    FAB: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.icon}</Text>
      </TouchableOpacity>
    ),
    RadioButton: RadioButtonMock,
    Provider: ({ children }) => <View>{children}</View>,
  };
});
