import '@testing-library/react-native';
import React from 'react';
import { View, Text } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <View {...props} />,
    Ionicons: (props) => <View {...props} />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return (props) => <View {...props} />;
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaView: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
  };
});

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn(() => ({
    Navigator: ({ children }) => {
      const { View } = require('react-native');
      const React = require('react');
      return <View>{React.Children.toArray(children)}</View>;
    },
    Screen: ({ component: Component }) => {
      const React = require('react');
      return <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />;
    },
  })),
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const ActualPaper = jest.requireActual('react-native-paper');

  const Card = Object.assign((props) => <View {...props} />, {
    Content: ({ children }) => <View>{children}</View>,
    Title: (props) => (
      <View>
        {props.title && <Text>{props.title}</Text>}
        {props.subtitle && <Text>{props.subtitle}</Text>}
        {props.left && props.left()}
        {props.right && props.right()}
      </View>
    ),
    Actions: ({ children }) => <View>{children}</View>,
  });

  const RadioButton = Object.assign((props) => <View {...props} />, {
    Group: ({ children }) => <View>{children}</View>,
    Item: (props) => <View {...props} />,
  });

  return {
    ...ActualPaper,
    Card,
    RadioButton,
  };
});
