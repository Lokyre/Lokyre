import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
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

// Mock react-native-paper icons
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  const actual = jest.requireActual('react-native-paper');

  const MockCard = Object.assign((props) => <TouchableOpacity {...props} />, {
    Content: (props) => <View {...props} />,
    Title: (props) => (
      <View {...props}>
        {props.left && props.left({ size: 24 })}
        {props.right && props.right({ size: 24 })}
      </View>
    ),
    Actions: (props) => <View {...props} />
  });

  const MockRadioButtonGroup = Object.assign(
    (props) => {
      return (
        <View {...props}>
          {React.Children.map(props.children, child => {
            return React.cloneElement(child, {
              onValueChange: props.onValueChange,
              selectedValue: props.value
            });
          })}
        </View>
      );
    },
    {
      Item: ({ value, label, onValueChange }) => (
        <TouchableOpacity testID={`radio-${value}`} onPress={() => onValueChange(value)}>
          <Text>{label}</Text>
        </TouchableOpacity>
      )
    }
  );

  return {
    ...actual,
    Card: MockCard,
    IconButton: (props) => <TouchableOpacity {...props}><Text>Icon</Text></TouchableOpacity>,
    FAB: (props) => <TouchableOpacity {...props}><Text>FAB</Text></TouchableOpacity>,
    Button: (props) => <TouchableOpacity {...props}><Text>{props.children}</Text></TouchableOpacity>,
    TextInput: (props) => <TextInput {...props} />,
    RadioButton: Object.assign({}, { Group: MockRadioButtonGroup, Item: MockRadioButtonGroup.Item }),
  };
});
