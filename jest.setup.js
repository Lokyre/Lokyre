import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-paper components properly
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  return {
    useTheme: () => ({ colors: { primary: 'blue', onPrimary: 'white', error: 'red' } }),
    FAB: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>FAB</Text></TouchableOpacity>,
    Title: (props) => <Text>{props.children}</Text>,
    Paragraph: (props) => <Text>{props.children}</Text>,
    Text: (props) => <Text>{props.children}</Text>,
    Card: Object.assign(
      (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}>{props.children}</TouchableOpacity>,
      {
        Content: (props) => <View>{props.children}</View>,
        Title: (props) => (
          <View>
            <Text>{props.title}</Text>
            <Text>{props.subtitle}</Text>
            {props.right && props.right()}
            {props.left && props.left()}
          </View>
        ),
      }
    ),
    TextInput: (props) => <TextInput testID={props.testID} value={props.value} onChangeText={props.onChangeText} />,
    Button: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>{props.children}</Text></TouchableOpacity>,
    RadioButton: Object.assign(
      (props) => <TouchableOpacity testID={props.testID} onPress={() => props.onPress(props.value)} />,
      {
        Group: (props) => (
          <View>
            {React.Children.map(props.children, (child) =>
              React.cloneElement(child, {
                onPress: props.onValueChange,
                selectedValue: props.value,
              })
            )}
          </View>
        ),
        Item: (props) => (
          <TouchableOpacity testID={props.testID} onPress={() => props.onPress(props.value)}>
            <Text>{props.label}</Text>
          </TouchableOpacity>
        ),
      }
    ),
  };
});

// Mock Alert
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons) {
    const defaultButton = buttons.find(b => b.text === 'Eliminar') || buttons[0];
    if (defaultButton && defaultButton.onPress) {
       defaultButton.onPress();
    }
  }
});
