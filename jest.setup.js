import '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text testID={props.testID}>{props.name}</Text>,
    Ionicons: (props) => <Text testID={props.testID}>{props.name}</Text>,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput } = require('react-native');
  const RealPaper = jest.requireActual('react-native-paper');

  const FAB = ({ testID, onPress, icon }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>{icon}</Text>
    </TouchableOpacity>
  );

  const RadioGroupMock = ({ onValueChange, value, children }) => {
    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        onValueChange,
        selectedValue: value,
      });
    });
  };

  const RadioItemMock = ({ label, value, onValueChange, selectedValue, testID }) => (
    <TouchableOpacity
      testID={testID}
      onPress={() => onValueChange(value)}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <Text>{label}</Text>
      <Text>{selectedValue === value ? 'checked' : 'unchecked'}</Text>
    </TouchableOpacity>
  );

  return {
    ...RealPaper,
    FAB,
    RadioButton: {
      Group: RadioGroupMock,
      Item: RadioItemMock,
    }
  };
});

// Mock for random values used by UUID
jest.mock('react-native-get-random-values', () => {
  const crypto = require('crypto');
  global.crypto = {
    getRandomValues: (buffer) => crypto.randomFillSync(buffer),
  };
});

// Mock alert

globalThis.alert = jest.fn();
jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});
