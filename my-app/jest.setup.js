import '@testing-library/react-native';

const { View } = require('react-native');

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => ({
  __esModule: true,
  default: () => {
    const { View } = require('react-native');
    return <View />;
  },
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
    AntDesign: () => <View />,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});
