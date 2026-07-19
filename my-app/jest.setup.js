import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => {
    const React = require('react');
    const { View } = require('react-native');
    return <View />;
  },
}));

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => () => {
  const React = require('react');
  const { View } = require('react-native');
  return <View />;
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const actualPaper = jest.requireActual('react-native-paper');

  return {
    ...actualPaper,
    Card: Object.assign((props) => <View {...props} testID={props.testID}>{props.children}</View>, {
      Title: (props) => (
        <View testID={props.testID}>
          {props.title && <Text testID={props.titleTestID}>{props.title}</Text>}
          {props.subtitle && <Text testID={props.subtitleTestID}>{props.subtitle}</Text>}
          {props.left && props.left()}
          {props.right && props.right()}
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
      Cover: ({ children }) => <View>{children}</View>,
    }),
    RadioButton: Object.assign((props) => <View {...props} />, {
      Group: ({ children }) => <View>{children}</View>
    })
  };
});

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />,
    }),
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Alert to prevent tests hanging
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0) {
    // Automatically trigger the destructive/confirmation button to simulate a user click
    const destructiveButton = buttons.find(b => b.style === 'destructive');
    if (destructiveButton && destructiveButton.onPress) {
      destructiveButton.onPress();
    }
  }
});
