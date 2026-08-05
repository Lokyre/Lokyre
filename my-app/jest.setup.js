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
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const Provider = ({ children }) => <View>{children}</View>;
  const Title = ({ children, ...props }) => <Text {...props}>{children}</Text>;
  const Paragraph = ({ children, ...props }) => <Text {...props}>{children}</Text>;

  const Card = Object.assign(
    ({ children, onPress, testID, ...props }) => (
      <TouchableOpacity testID={testID} onPress={onPress} {...props}>
        {children}
      </TouchableOpacity>
    ),
    {
      Content: ({ children, ...props }) => <View {...props}>{children}</View>,
      Actions: ({ children, ...props }) => <View {...props}>{children}</View>,
      Title: ({ title, subtitle, right, ...props }) => (
        <View {...props}>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {right && right()}
        </View>
      ),
    }
  );

  const FAB = ({ testID, onPress, ...props }) => (
    <TouchableOpacity testID={testID} onPress={onPress} {...props}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );

  const Button = ({ children, testID, onPress, ...props }) => (
    <TouchableOpacity testID={testID} onPress={onPress} {...props}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );

  const PaperTextInput = ({ value, onChangeText, testID, ...props }) => (
    <TextInput testID={testID} value={value} onChangeText={onChangeText} {...props} />
  );

  const RadioButton = Object.assign(
    ({ value, status, onPress }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{value}</Text>
      </TouchableOpacity>
    ),
    {
      Group: ({ children, onValueChange, value }) => (
        <View>{children}</View>
      )
    }
  );

  const ActivityIndicator = () => <View testID="activity-indicator" />;

  return {
    Provider,
    Title,
    Paragraph,
    Card,
    FAB,
    Button,
    TextInput: PaperTextInput,
    RadioButton,
    ActivityIndicator,
    useTheme: () => ({ colors: { primary: 'blue' } }),
    Text: ({ children, ...props }) => <Text {...props}>{children}</Text>
  };
});
