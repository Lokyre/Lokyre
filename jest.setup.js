import React from 'react';
import '@testing-library/react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

// Mock react-native-paper icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Ensure animations are skipped
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock uuid to have consistent test output (optional, but good)
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234'
}));
