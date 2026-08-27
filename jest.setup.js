import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) }
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    Text: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    TextInput: ({ children, ...props }) => <TextInput {...props}>{children}</TextInput>,
    Button: ({ children, testID, onPress }) => <TouchableOpacity testID={testID} onPress={onPress}><Text>{children}</Text></TouchableOpacity>,
    Title: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Paragraph: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Card: Object.assign(
      ({ children, testID, onPress }) => (
        <TouchableOpacity testID={testID} onPress={onPress}>
          {children}
        </TouchableOpacity>
      ),
      {
        Title: ({ title, subtitle, right, left }) => (
          <View>
            <Text>{title}</Text>
            {subtitle && <Text>{subtitle}</Text>}
            {left && left()}
            {right && right()}
          </View>
        ),
        Content: ({ children }) => <View>{children}</View>,
        Actions: ({ children }) => <View>{children}</View>
      }
    ),
    IconButton: ({ icon, testID, onPress }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>Icon: {icon}</Text>
      </TouchableOpacity>
    ),
    FAB: ({ icon, testID, onPress }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>FAB: {icon}</Text>
      </TouchableOpacity>
    ),
    RadioButton: Object.assign(
      ({ value, status }) => <Text>Radio: {value} ({status})</Text>,
      {
        Group: ({ children, onValueChange, value }) => {
          return React.Children.map(children, child =>
            React.cloneElement(child, {
              onValueChange,
              selectedValue: value
            })
          );
        }
      }
    )
  };
});

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
