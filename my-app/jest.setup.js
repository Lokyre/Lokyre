import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const { View } = require('react-native');
  return {
    SafeAreaProvider: jest.fn(({ children }) => <View>{children}</View>),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});

// Mock react-navigation/native
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({ params: {} })),
  };
});

// Mock @react-navigation/stack
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

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-paper components to avoid testing issues
jest.mock('react-native-paper', () => {
  const ActualPaper = jest.requireActual('react-native-paper');
  const View = require('react-native').View;
  const Text = require('react-native').Text;
  const TouchableOpacity = require('react-native').TouchableOpacity;
  const TextInput = require('react-native').TextInput;

  return {
    ...ActualPaper,
    FAB: (props) => <TouchableOpacity {...props} testID={props.testID || 'mock-fab'}><Text>FAB</Text></TouchableOpacity>,
    Button: (props) => <TouchableOpacity {...props} testID={props.testID || 'mock-btn'}><Text>{props.children}</Text></TouchableOpacity>,
    TextInput: (props) => <TextInput {...props} testID={props.testID || 'mock-text-input'} />,
    Title: (props) => <Text {...props} testID={props.testID}>{props.children}</Text>,
    Paragraph: (props) => <Text {...props} testID={props.testID}>{props.children}</Text>,
    Text: (props) => <Text {...props} testID={props.testID}>{props.children}</Text>,
    Card: Object.assign(
      (props) => <TouchableOpacity {...props} testID={props.testID} onPress={props.onPress}><View>{props.children}</View></TouchableOpacity>,
      {
        Content: (props) => <View {...props}>{props.children}</View>,
        Title: (props) => (
          <View>
            <Text>{props.title}</Text>
            {props.subtitle && <Text>{props.subtitle}</Text>}
            {props.right && props.right()}
            {props.left && props.left()}
          </View>
        ),
      }
    ),
    ActivityIndicator: () => <View testID="activity-indicator" />,
    RadioButton: Object.assign(
      (props) => <TouchableOpacity {...props} testID={props.testID || 'mock-radio'} onPress={() => props.onValueChange && props.onValueChange(props.value)} />,
      {
        Group: (props) => <View {...props} testID={props.testID}>{props.children}</View>,
      }
    ),
  };
});

// Mock uuid to have consistent test ids if necessary, although mocking get-random-values works too
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));
