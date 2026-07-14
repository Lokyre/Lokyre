import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    }),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});

// Mock vector icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <View {...props} testID={props.testID || 'icon'} />,
    Ionicons: (props) => <View {...props} testID={props.testID || 'icon'} />
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return (props) => <View {...props} testID={props.testID || 'icon'} />;
});

// Fix testing-library React Native Paper nested texts
jest.mock('react-native-paper', () => {
  const ActualPaper = jest.requireActual('react-native-paper');
  const { View, Text } = require('react-native');

  const MockCard = (props) => <ActualPaper.Card {...props} />;
  Object.assign(MockCard, ActualPaper.Card, {
    Title: ({ title, subtitle, ...props }) => (
      <View {...props}>
        {title && <Text>{title}</Text>}
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    ),
    Content: ({ children, ...props }) => <View {...props}>{children}</View>,
    Actions: ({ children, ...props }) => <View {...props}>{children}</View>,
    Cover: (props) => <View {...props} />,
  });

  const MockRadioButton = (props) => <ActualPaper.RadioButton {...props} />;
  Object.assign(MockRadioButton, ActualPaper.RadioButton, {
    Group: ({ children, ...props }) => <View {...props}>{children}</View>,
  });

  return {
    ...ActualPaper,
    Card: MockCard,
    RadioButton: MockRadioButton,
  };
});
