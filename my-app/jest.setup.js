import 'react-native-gesture-handler/jestSetup';
import '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
  SafeAreaConsumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }),
  SafeAreaInsetsContext: {
    Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }),
  },
  useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput } = require('react-native');
  const actual = jest.requireActual('react-native-paper');

  return {
    ...actual,
    Card: Object.assign(({ children, testID, onPress }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        {children}
      </TouchableOpacity>
    ), {
      Title: ({ title, subtitle, right, left }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {left && left()}
          {right && right()}
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
      Cover: ({ children }) => <View>{children}</View>,
    }),
    Button: ({ children, onPress, testID }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
    TextInput: ({ value, onChangeText, testID, placeholder }) => (
      <RNTextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    ),
    Text: ({ children }) => <Text>{children}</Text>,
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    ActivityIndicator: () => <View testID="activity-indicator" />,
    FAB: ({ onPress, testID }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>FAB</Text>
      </TouchableOpacity>
    ),
    IconButton: ({ onPress, testID }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>Icon</Text>
      </TouchableOpacity>
    ),
    RadioButton: Object.assign(({ value, status, onPress }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{value}</Text>
      </TouchableOpacity>
    ), {
      Group: ({ onValueChange, value, children }) => (
        <View value={value} onValueChange={onValueChange}>
          {children}
        </View>
      ),
      Item: ({ value, status, onPress }) => (
        <TouchableOpacity onPress={onPress}>
          <Text>{value}</Text>
        </TouchableOpacity>
      ),
    }),
  };
});
