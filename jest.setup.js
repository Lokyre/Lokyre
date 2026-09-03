import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => {
  const React = require('react');
  return { __esModule: true, default: jest.fn(() => null) };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const Provider = ({ children }) => <View>{children}</View>;
  const Button = ({ children, onPress, testID }) => <TouchableOpacity onPress={onPress} testID={testID}><Text>{children}</Text></TouchableOpacity>;
  const IconButton = ({ onPress, testID }) => <TouchableOpacity onPress={onPress} testID={testID}><Text>IconButton</Text></TouchableOpacity>;
  const FAB = ({ onPress, testID }) => <TouchableOpacity onPress={onPress} testID={testID}><Text>FAB</Text></TouchableOpacity>;

  const Card = Object.assign(
    ({ children, onPress, testID, style }) => <TouchableOpacity onPress={onPress} testID={testID} style={style}>{children}</TouchableOpacity>,
    {
      Title: ({ title, subtitle, right }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {right && right()}
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
    }
  );

  const RadioGroup = ({ children, onValueChange, value }) => {
    return (
      <View>
        {React.Children.map(children, child => {
           if (!React.isValidElement(child)) return child;
           return React.cloneElement(child, {
             onValueChange,
             selectedValue: value // React Native Paper often passes selectedValue down
           });
        })}
      </View>
    );
  };
  const Radio = ({ value, onValueChange, testID }) => (
    <TouchableOpacity onPress={() => { if (onValueChange) onValueChange(value); }} testID={testID || `radio-${value}`}>
      <Text>{value}</Text>
    </TouchableOpacity>
  );

  const RadioItem = ({ label, value, onValueChange, testID }) => (
    <TouchableOpacity onPress={() => { if (onValueChange) onValueChange(value); }} testID={testID || `radio-${value}`}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  const RadioButtonMock = Object.assign(Radio, { Group: RadioGroup, Item: RadioItem });

  return {
    Provider,
    Button,
    IconButton,
    FAB,
    Card,
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    Text: ({ children, style }) => <Text style={style}>{children}</Text>,
    TextInput: (props) => <TextInput {...props} />,
    RadioButton: RadioButtonMock,
    useTheme: () => ({ colors: { primary: '#000', onPrimary: '#fff' } })
  };
});
