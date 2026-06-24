import 'react-native-gesture-handler/jestSetup';
import { View } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  mergeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  flushGetRequests: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  multiMerge: jest.fn(),
}));

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

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View } = require('react-native');
  const paper = jest.requireActual('react-native-paper');

  const MockCardContent = ({ children }) => <View>{children}</View>;
  const MockCardTitle = ({ title, subtitle, left, right }) => (
    <View>
      {left && left()}
      <View>
        <View>{title}</View>
        <View>{subtitle}</View>
      </View>
      {right && right()}
    </View>
  );

  const MockCard = ({ children, ...props }) => <View {...props}>{children}</View>;
  MockCard.Content = MockCardContent;
  MockCard.Title = MockCardTitle;
  MockCard.Actions = ({ children }) => <View>{children}</View>;
  MockCard.Cover = ({ source }) => <View />;

  const MockRadioButtonGroup = ({ children }) => <View>{children}</View>;
  const MockRadioButtonItem = ({ value, label }) => <View accessibilityLabel={label} value={value} />;
  const MockRadioButton = ({ value }) => <View value={value} />;
  MockRadioButton.Group = MockRadioButtonGroup;
  MockRadioButton.Item = MockRadioButtonItem;

  return {
    ...paper,
    Card: MockCard,
    RadioButton: MockRadioButton,
  };
});

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
    Ionicons: () => <View />,
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Note: memory explicitly states: In newer versions of React Native, do not mock `react-native/Libraries/Animated/NativeAnimatedHelper` in `jest.setup.js` as it causes 'Could not locate module' configuration errors during testing.
