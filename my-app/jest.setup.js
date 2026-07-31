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
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }),
    },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  return {
    ...jest.requireActual('react-native-paper'),
    Card: Object.assign(({ children, testID, onPress }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        {children}
      </TouchableOpacity>
    ), {
      Title: ({ title, subtitle, testID }) => (
        <View testID={testID}>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
    }),
    FAB: ({ onPress, testID }) => <TouchableOpacity testID={testID} onPress={onPress}><Text>FAB</Text></TouchableOpacity>,
    ActivityIndicator: () => <Text>Loading</Text>,
    TextInput: ({ value, onChangeText, testID, label }) => (
      <TextInput testID={testID} value={value} onChangeText={onChangeText} accessibilityLabel={label} />
    ),
    Button: ({ children, onPress, testID }) => (
      <TouchableOpacity testID={testID} onPress={onPress}><Text>{children}</Text></TouchableOpacity>
    ),
    RadioButton: Object.assign(({ value, testID }) => (
      <View testID={testID}><Text>{value}</Text></View>
    ), {
      Group: ({ children, onValueChange, value }) => (
        <View>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { onValueChange, value })
          )}
        </View>
      )
    }),
    Text: ({ children, style, variant }) => <Text style={style}>{children}</Text>,
    Divider: () => <View />,
  };
});
