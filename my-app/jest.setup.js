import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

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

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const actualPaper = jest.requireActual('react-native-paper');

  const MockCardContent = ({ children, ...props }) => <View {...props}>{children}</View>;
  const MockCardTitle = ({ title, subtitle, ...props }) => (
    <View {...props}>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );

  return {
    ...actualPaper,
    Card: {
      ...actualPaper.Card,
      Content: MockCardContent,
      Title: MockCardTitle,
    },
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return ({ name, color, size }) => <View testID={`icon-${name}`} />;
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: ({ name, color, size }) => <View testID={`icon-${name}`} />,
    Ionicons: ({ name, color, size }) => <View testID={`icon-${name}`} />,
    FontAwesome: ({ name, color, size }) => <View testID={`icon-${name}`} />,
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => (
        <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />
      ),
    }),
  };
});
