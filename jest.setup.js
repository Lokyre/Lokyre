import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
    },
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  return {
    Provider: ({ children }) => <View>{children}</View>,
    Text: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Title: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Paragraph: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Button: ({ children, onPress, testID, ...props }) => (
      <TouchableOpacity onPress={onPress} testID={testID} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
    FAB: ({ onPress, testID, ...props }) => (
      <TouchableOpacity onPress={onPress} testID={testID} {...props}>
        <Text>FAB</Text>
      </TouchableOpacity>
    ),
    Card: Object.assign(({ children, onPress, testID, ...props }) => (
      <TouchableOpacity onPress={onPress} testID={testID} {...props}>
        {children}
      </TouchableOpacity>
    ), {
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
    }),
    TextInput: ({ ...props }) => <TextInput {...props} />,
    RadioButton: Object.assign(({ ...props }) => <View {...props} />, {
      Group: ({ children, onValueChange, value }) => {
        return (
          <View>
            {React.Children.map(children, child =>
              React.cloneElement(child, { onValueChange, selectedValue: value })
            )}
          </View>
        );
      },
      Item: ({ label, value, onValueChange, selectedValue, testID }) => (
        <TouchableOpacity
          testID={testID}
          onPress={() => onValueChange && onValueChange(value)}
        >
          <Text>{label} {selectedValue === value ? '(selected)' : ''}</Text>
        </TouchableOpacity>
      )
    }),
  };
});

jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: jest.fn(() => null)
  };
});

global.alert = jest.fn();
