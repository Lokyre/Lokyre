import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Swipeable: ({ children }) => <View>{children}</View>,
    DrawerLayout: ({ children }) => <View>{children}</View>,
    State: {},
    PanGestureHandler: ({ children }) => <View>{children}</View>,
    TapGestureHandler: ({ children }) => <View>{children}</View>,
    FlingGestureHandler: ({ children }) => <View>{children}</View>,
    ForceTouchGestureHandler: ({ children }) => <View>{children}</View>,
    LongPressGestureHandler: ({ children }) => <View>{children}</View>,
    PinchGestureHandler: ({ children }) => <View>{children}</View>,
    RotationGestureHandler: ({ children }) => <View>{children}</View>,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({ params: {} })),
    NavigationContainer: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
  };
});

// Mock @react-navigation/stack
jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => {
      const React = require('react');
      const { View } = require('react-native');
      return {
        Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
        Screen: ({ component: Component }) => {
          const React = require('react');
          return <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />;
        },
      };
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const PaperButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );

  const FAB = (props) => (
    <TouchableOpacity testID={props.testID || 'fab'} onPress={props.onPress}>
      <Text>+</Text>
    </TouchableOpacity>
  );

  const IconButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>icon</Text>
    </TouchableOpacity>
  );

  const PaperTextInput = (props) => (
    <TextInput
      testID={props.testID}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.label || props.placeholder}
      keyboardType={props.keyboardType}
    />
  );

  const Card = Object.assign((props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      {props.children}
    </TouchableOpacity>
  ), {
    Title: (props) => (
      <View testID={props.testID}>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        {props.right && props.right()}
        {props.left && props.left()}
      </View>
    ),
    Content: (props) => <View>{props.children}</View>,
  });

  const RadioGroup = (props) => {
    return (
      <View>
        {React.Children.map(props.children, child => {
          return React.cloneElement(child, {
            onValueChange: props.onValueChange,
            selectedValue: props.value
          });
        })}
      </View>
    );
  };

  const RadioItem = (props) => (
    <TouchableOpacity testID={props.testID} onPress={() => props.onValueChange && props.onValueChange(props.value)}>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    Button: PaperButton,
    FAB: FAB,
    IconButton: IconButton,
    TextInput: PaperTextInput,
    Card: Card,
    Text: ({ children }) => <Text>{children}</Text>,
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    RadioButton: {
      Group: RadioGroup,
      Item: RadioItem,
    },
    useTheme: () => ({ colors: { primary: 'blue' } })
  };
});
