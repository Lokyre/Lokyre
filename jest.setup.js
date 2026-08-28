import 'react-native-gesture-handler/jestSetup';

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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});

// Avoid 'Element type is invalid' for FAB, IconButton, etc.
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput } = require('react-native');

  const Card = Object.assign(
    ({ children, testID, onPress, ...props }) => (
      <TouchableOpacity testID={testID} onPress={onPress} {...props}>
        {children}
      </TouchableOpacity>
    ),
    {
      Title: ({ title, subtitle, right, left, ...props }) => (
        <View {...props}>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {left && left()}
          {right && right()}
        </View>
      ),
      Content: ({ children, ...props }) => <View {...props}>{children}</View>,
    }
  );

  const RadioGroup = ({ children, onValueChange, value, ...props }) => (
    <View {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { onValueChange, selectedValue: value })
      )}
    </View>
  );

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    MD3LightTheme: { colors: {} },
    useTheme: () => ({ colors: { error: 'red', outline: 'gray', primary: 'blue' } }),
    Card,
    Text: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    TextInput: ({ ...props }) => <RNTextInput {...props} />,
    Button: ({ children, testID, onPress, ...props }) => (
      <TouchableOpacity testID={testID} onPress={onPress} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
    IconButton: ({ testID, onPress, ...props }) => (
      <TouchableOpacity testID={testID} onPress={onPress} {...props}>
        <Text>Icon</Text>
      </TouchableOpacity>
    ),
    FAB: ({ testID, onPress, ...props }) => (
      <TouchableOpacity testID={testID} onPress={onPress} {...props}>
        <Text>FAB</Text>
      </TouchableOpacity>
    ),
    RadioButton: Object.assign(
      ({ value, onValueChange, ...props }) => (
        <TouchableOpacity onPress={() => onValueChange(value)} {...props}>
          <Text>Radio {value}</Text>
        </TouchableOpacity>
      ),
      { Group: RadioGroup }
    ),
    ActivityIndicator: () => <View />,
    Divider: () => <View />,
    SegmentedButtons: ({ value, onValueChange, buttons, ...props }) => (
      <View {...props}>
        {buttons.map(btn => (
          <TouchableOpacity key={btn.value} onPress={() => onValueChange(btn.value)}>
            <Text>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
});