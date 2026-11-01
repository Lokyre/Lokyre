import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest'));

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

// Mock react-native-paper icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
  };
});

// Mock react-native-safe-area-context
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
