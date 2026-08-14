import '@testing-library/react-native';
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation Native
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

// Mock react-native-paper components to simplify testing
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const Paper = {
    Provider: ({ children }) => children,
    Text: (props) => <Text {...props}>{props.children}</Text>,
    Title: (props) => <Text {...props}>{props.children}</Text>,
    Paragraph: (props) => <Text {...props}>{props.children}</Text>,
    Button: (props) => <TouchableOpacity {...props}><Text>{props.children}</Text></TouchableOpacity>,
    TextInput: (props) => <TextInput {...props} />,
    FAB: (props) => <TouchableOpacity {...props}><Text>FAB</Text></TouchableOpacity>,
    IconButton: (props) => <TouchableOpacity {...props}><Text>Icon</Text></TouchableOpacity>,
    Card: Object.assign(
      (props) => <TouchableOpacity {...props}>{props.children}</TouchableOpacity>,
      {
        Content: (props) => <View {...props}>{props.children}</View>,
        Title: (props) => (
          <View>
            <Text testID={props.titleTestID}>{props.title}</Text>
            <Text testID={props.subtitleTestID}>{props.subtitle}</Text>
            {props.right && props.right({ testID: 'right-action' })}
          </View>
        ),
      }
    ),
    RadioButton: Object.assign(
      (props) => <TouchableOpacity {...props} onPress={() => {}} />,
      {
        Group: (props) => <View {...props}>{props.children}</View>,
      }
    ),
    useTheme: () => ({ colors: { error: 'red' } }),
  };
  return Paper;
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});

// Polyfill for Alert
jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});
