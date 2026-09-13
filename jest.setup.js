import React from 'react';
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock React Navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: (props) => props.children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const CardMock = Object.assign((props) => <TouchableOpacity {...props} />, {
    Title: (props) => (
      <View>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        {props.right && props.right({})}
      </View>
    ),
    Content: (props) => <View {...props} />,
  });

  const RadioGroupMock = Object.assign((props) => {
    return React.Children.map(props.children, (child) =>
      React.cloneElement(child, {
        onValueChange: props.onValueChange,
        selectedValue: props.value,
      })
    );
  }, {
    Item: (props) => (
      <TouchableOpacity
        onPress={() => props.onValueChange && props.onValueChange(props.value)}
        testID={props.testID}
      >
        <Text>{props.label}</Text>
      </TouchableOpacity>
    )
  });

  return {
    Provider: ({ children }) => <View>{children}</View>,
    MD3LightTheme: {},
    useTheme: () => ({ colors: { primaryContainer: '#fff' } }),
    FAB: (props) => <TouchableOpacity {...props}><Text>FAB</Text></TouchableOpacity>,
    Card: CardMock,
    Title: (props) => <Text {...props} />,
    Paragraph: (props) => <Text {...props} />,
    Text: (props) => <Text {...props} />,
    Button: (props) => <TouchableOpacity {...props}><Text>{props.children}</Text></TouchableOpacity>,
    TextInput: (props) => <TextInput {...props} />,
    RadioButton: RadioGroupMock,
  };
});

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
  };
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));
