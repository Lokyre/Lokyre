import 'react-native-gesture-handler/jestSetup';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null)
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
    Ionicons: (props) => <Text {...props}>{props.name}</Text>,
  };
});

jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});
