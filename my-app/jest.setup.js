import '@testing-library/react-native';

// Mock SafeAreaInsetsContext from react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});

// Mock MaterialCommunityIcon
jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return ({ children, ...props }) => <View {...props} testID="mock-icon" />;
});

// Mock vector icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: ({ children, ...props }) => <View {...props} testID="mock-icon" />,
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));


jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'test-uuid'),
  };
});
