const { View } = require('react-native');

// Mock react-native-gesture-handler
require('react-native-gesture-handler/jestSetup');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});

// Mock react-native-paper icons
jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return ({ children }) => <View>{children}</View>;
});
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: ({ children }) => <View>{children}</View>,
    Ionicons: ({ children }) => <View>{children}</View>,
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock NativeAnimatedHelper
// Do not mock NativeAnimatedHelper as per memory guidelines

// Mock React Native Paper specific inner components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View } = require('react-native');
  const RealModule = jest.requireActual('react-native-paper');

  const MockedCard = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockedCard.Content = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockedCard.Actions = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockedCard.Title = ({ title, subtitle, ...props }) => (
    <View {...props}>
      <View>{title}</View>
      <View>{subtitle}</View>
    </View>
  );

  const MockedRadioButton = ({ ...props }) => <View {...props} />;
  MockedRadioButton.Group = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockedRadioButton.Item = ({ ...props }) => <View {...props} />;
  MockedRadioButton.Android = ({ ...props }) => <View {...props} />;
  MockedRadioButton.IOS = ({ ...props }) => <View {...props} />;

  return {
    ...RealModule,
    Card: MockedCard,
    RadioButton: MockedRadioButton,
  };
});
