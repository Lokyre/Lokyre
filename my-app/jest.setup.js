import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View testID="material-community-icon-mock" />;
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View testID="mock-expo-vector-icons" />
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  const Paper = jest.requireActual('react-native-paper');

  return {
    ...Paper,
    Card: {
      ...Paper.Card,
      Content: ({ children }) => <View>{children}</View>,
      Title: ({ title, subtitle }) => (
        <View>
          {title && <Text>{title}</Text>}
          {subtitle && <Text>{subtitle}</Text>}
        </View>
      )
    },
    RadioButton: {
      ...Paper.RadioButton,
      Group: ({ children }) => <View>{children}</View>,
    }
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() }} route={{ params: {} }} />
    }),
  };
});
