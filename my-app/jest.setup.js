import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
    Feather: () => <View />,
    FontAwesome: () => <View />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View />,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }),
    },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
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

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const RealPaper = jest.requireActual('react-native-paper');

  const Card = ({ children, ...props }) => <View {...props}>{children}</View>;
  Card.Content = ({ children, ...props }) => <View {...props}>{children}</View>;
  Card.Actions = ({ children, ...props }) => <View {...props}>{children}</View>;
  Card.Title = ({ title, subtitle, right, ...props }) => (
    <View {...props}>
      {title && <Text>{title}</Text>}
      {subtitle && <Text>{subtitle}</Text>}
      {right && right({})}
    </View>
  );

  return {
    ...RealPaper,
    Card,
    RadioButton: {
      ...RealPaper.RadioButton,
      Group: ({ children, ...props }) => <View {...props}>{children}</View>,
    },
  };
});
