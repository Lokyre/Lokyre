import React from 'react';
import { View } from 'react-native';

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    }
  };
});

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
    FontAwesome: () => <View />,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  const RealPaper = jest.requireActual('react-native-paper');

  const MockFAB = (props) => <TouchableOpacity testID={props.testID || "fab"} onPress={props.onPress} {...props}><Text>FAB</Text></TouchableOpacity>;

  const MockCard = ({ children, style, onPress }) => (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
  MockCard.Content = ({ children }) => <View>{children}</View>;
  MockCard.Title = ({ title, subtitle }) => (
    <View>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );

  const MockRadioButton = ({ children }) => <View>{children}</View>;
  MockRadioButton.Group = ({ children, onValueChange, value }) => <View>{children}</View>;
  MockRadioButton.Item = ({ label, value }) => <View><Text>{label}</Text></View>;

  return {
    ...RealPaper,
    FAB: MockFAB,
    Card: MockCard,
    RadioButton: MockRadioButton,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View />
  };
});
