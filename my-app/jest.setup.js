import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, left: 0, bottom: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, left: 0, bottom: 0 })),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
    FontAwesome: () => <View />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const Paper = jest.requireActual('react-native-paper');

  const MockCard = Object.assign((props) => <View {...props}>{props.children}</View>, {
    Content: ({ children }) => <View>{children}</View>,
    Actions: ({ children }) => <View>{children}</View>,
    Title: (props) => (
      <View>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        {props.right && props.right()}
        {props.left && props.left()}
      </View>
    ),
    Cover: () => <View />,
  });

  const MockRadioButton = Object.assign((props) => <View {...props} />, {
    Group: ({ children }) => <View>{children}</View>,
    Item: () => <View />,
    Android: () => <View />,
    IOS: () => <View />,
  });

  return {
    ...Paper,
    Card: MockCard,
    RadioButton: MockRadioButton,
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
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
