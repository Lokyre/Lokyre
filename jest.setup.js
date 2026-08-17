import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({ params: {} })),
  };
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

// Mock React Native Paper components that might cause issues
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const Card = Object.assign((props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}>{props.children}</TouchableOpacity>, {
    Title: (props) => (
      <View>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        {props.right && props.right({})}
        {props.left && props.left({})}
      </View>
    ),
    Content: (props) => <View>{props.children}</View>,
    Cover: (props) => <View />,
    Actions: (props) => <View>{props.children}</View>,
  });

  const RadioButtonGroup = (props) => {
    return React.Children.map(props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          onValueChange: props.onValueChange,
          selectedValue: props.value
        });
      }
      return child;
    });
  };

  const RadioButton = (props) => {
    return (
      <TouchableOpacity
        testID={props.testID}
        onPress={() => props.onValueChange && props.onValueChange(props.value)}
      >
        <Text>{props.value}</Text>
      </TouchableOpacity>
    );
  };

  return {
    ...jest.requireActual('react-native-paper'),
    Card,
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
    TextInput: (props) => (
      <TextInput
        testID={props.testID}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.label}
      />
    ),
    Button: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.children}</Text>
      </TouchableOpacity>
    ),
    RadioButton: Object.assign(RadioButton, { Group: RadioButtonGroup }),
    Chip: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.children}</Text>
      </TouchableOpacity>
    ),
    Title: (props) => <Text style={props.style}>{props.children}</Text>,
    Paragraph: (props) => <Text style={props.style}>{props.children}</Text>,
  };
});
