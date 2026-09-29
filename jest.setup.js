import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer:  ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const Paper = jest.requireActual('react-native-paper');

  return {
    ...Paper,
    FAB: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>FAB: {props.icon}</Text>
      </TouchableOpacity>
    ),
    IconButton: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>IconButton: {props.icon}</Text>
      </TouchableOpacity>
    ),
    RadioButton: {
      ...Paper.RadioButton,
      Group: (props) => {
        return React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onValueChange: props.onValueChange,
              selectedValue: props.value,
            });
          }
          return child;
        });
      },
      Item: (props) => {
        const isSelected = props.value === props.selectedValue;
        return (
          <TouchableOpacity
            testID={props.testID}
            onPress={() => props.onValueChange && props.onValueChange(props.value)}
          >
            <Text>{props.label} {isSelected ? '(Selected)' : ''}</Text>
          </TouchableOpacity>
        );
      }
    }
  };
});
