import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve(null)),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve(null)),
  clear: jest.fn(() => Promise.resolve(null)),
}));

// Mock Navigation Native
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

// Mock Stack Navigator
jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => {
      const React = require('react');
      const { View } = require('react-native');
      return {
        Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
        Screen: ({ component: Component }) => (
          <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
        ),
      };
    },
  };
});

// Mock Safe Area Context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});

// Mock react-native-paper elements
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput: RNTextInput, TouchableOpacity, ActivityIndicator } = require('react-native');
  return {
    ...jest.requireActual('react-native-paper'),
    FAB: (props) => <TouchableOpacity {...props} />,
    Text: (props) => <Text {...props}>{props.children}</Text>,
    Title: (props) => <Text {...props}>{props.children}</Text>,
    Paragraph: (props) => <Text {...props}>{props.children}</Text>,
    Button: (props) => <TouchableOpacity {...props}>{props.children}</TouchableOpacity>,
    TextInput: (props) => <RNTextInput {...props} />,
    ActivityIndicator: (props) => <ActivityIndicator {...props} />,
    Card: Object.assign(
      (props) => <TouchableOpacity {...props}>{props.children}</TouchableOpacity>,
      {
        Content: (props) => <View {...props} />,
        Actions: (props) => <View {...props} />,
        Title: (props) => (
          <View {...props}>
            <Text>{props.title}</Text>
            <Text>{props.subtitle}</Text>
            {props.right && props.right()}
            {props.left && props.left()}
          </View>
        ),
      }
    ),
    RadioButton: Object.assign(
      (props) => <TouchableOpacity {...props} />,
      {
        Group: (props) => <View {...props}>{props.children}</View>,
      }
    ),
    useTheme: () => ({ colors: { error: 'red', primary: 'blue' } }),
  };
});
