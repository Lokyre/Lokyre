import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import { View, Text, TextInput } from 'react-native';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => {
      const React = require('react');
      const { View } = require('react-native');
      return {
        Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
        Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />,
      };
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Mock react-native-paper components properly to avoid 'Element type is invalid'
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput } = require('react-native');
  const paper = jest.requireActual('react-native-paper');

  const MockCard = (props) => <View {...props} testID={props.testID || 'card'} />;
  MockCard.Content = ({ children }) => <View>{children}</View>;
  MockCard.Title = (props) => (
    <View testID={props.testID}>
      {props.title && <Text>{props.title}</Text>}
      {props.subtitle && <Text>{props.subtitle}</Text>}
      {props.left && props.left()}
      {props.right && props.right()}
    </View>
  );

  const MockRadioButton = (props) => <View {...props} />;
  MockRadioButton.Group = ({ children }) => <View>{children}</View>;
  MockRadioButton.Item = (props) => <View testID={props.testID} {...props} />;

  return {
    ...paper,
    Card: MockCard,
    RadioButton: MockRadioButton,
    ActivityIndicator: (props) => <View testID="ActivityIndicator" {...props} />,
    Title: (props) => <Text testID="title-component" {...props} />,
    Paragraph: (props) => <Text testID="paragraph-component" {...props} />,
    TextInput: (props) => <TextInput testID={props.testID} onChangeText={props.onChangeText} value={props.value} />,
    Button: (props) => <Text testID={props.testID} onPress={props.onPress}>{props.children}</Text>,
  };
});

// Mock MaterialCommunityIcon to prevent test rendering errors
jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View testID="MaterialCommunityIcon" />;
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View testID="MaterialCommunityIcons" />,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});
