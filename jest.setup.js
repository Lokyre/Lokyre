import 'react-native-gesture-handler/jestSetup';
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => {
  const React = require('react');
  return { __esModule: true, default: jest.fn(() => null) };
});
jest.mock('expo-status-bar', () => ({ StatusBar: jest.fn(() => null) }));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(JSON.stringify([])),
  setItem: jest.fn(),
  clear: jest.fn()
}));
jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return { MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text> };
});
const mockSafeAreaContext = require('react-native-safe-area-context/jest/mock').default;
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
