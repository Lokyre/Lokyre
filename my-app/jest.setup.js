import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-paper components to prevent element type invalid errors
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  const actualPaper = jest.requireActual('react-native-paper');

  const MockCard = ({ children, testID, onPress, style }) => (
    <TouchableOpacity testID={testID} onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
  MockCard.Title = ({ title, subtitle }) => <View><Text>{title}</Text><Text>{subtitle}</Text></View>;
  MockCard.Content = ({ children }) => <View>{children}</View>;

  const MockRadioButton = ({ value }) => <View testID={`radio-${value}`} />;
  MockRadioButton.Group = ({ children, onValueChange, value }) => (
    <View testID="radio-group" value={value}>{children}</View>
  );

  const MockFAB = ({ onPress, testID }) => (
    <TouchableOpacity testID={testID || 'fab'} onPress={onPress}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );

  return {
    ...actualPaper,
    Card: MockCard,
    RadioButton: MockRadioButton,
    FAB: MockFAB,
  };
});

// Mock MaterialCommunityIcon to return a simple View
jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
  };
});
