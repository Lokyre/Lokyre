import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});

// Mock react-native-paper icons
jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View testID="mock-icon" />;
});
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View testID="mock-icon" />,
  };
});

// Mock react-native-paper components properly
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  const Paper = jest.requireActual('react-native-paper');

  return {
    ...Paper,
    Card: Object.assign(({ children, testID, ...props }) => <View testID={testID} {...props}>{children}</View>, {
      Content: ({ children }) => <View>{children}</View>,
      Title: ({ children }) => <Text>{children}</Text>,
    }),
    RadioButton: Object.assign(({ value, ...props }) => <View testID={`radio-${value}`} {...props} />, {
      Group: ({ children }) => <View>{children}</View>,
    }),
    FAB: ({ testID, onPress }) => <TouchableOpacity testID={testID} onPress={onPress}><Text>FAB</Text></TouchableOpacity>,
    ActivityIndicator: () => <View testID="activity-indicator" />,
  };
});
