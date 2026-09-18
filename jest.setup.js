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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
  useRoute: jest.fn(() => ({ params: {} })),
  NavigationContainer: ({ children }) => {
    const React = require('react');
    const { View } = require('react-native');
    return <View>{children}</View>;
  }
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
      Navigator: ({ children }) => <View>{children}</View>,
      Screen: ({ children }) => <View>{children}</View>,
    };
  }
}));


jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const MockTitle = ({ children }) => <Text>{children}</Text>;
  const MockParagraph = ({ children }) => <Text>{children}</Text>;

  const MockFAB = ({ testID, onPress }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );

  const MockCard = ({ children, testID, onPress, style }) => (
    <TouchableOpacity testID={testID} onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
  MockCard.Content = ({ children }) => <View>{children}</View>;

  const MockButton = ({ children, onPress, testID }) => (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );

  const MockTextInput = (props) => <TextInput {...props} />;

  const MockRadioButtonGroup = ({ onValueChange, value, children }) => {
    return (
      <View>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            onValueChange: onValueChange,
            selectedValue: value,
          })
        )}
      </View>
    );
  };

  const MockRadioButtonItem = ({ label, value, testID, onValueChange, selectedValue }) => (
    <TouchableOpacity testID={testID} onPress={() => onValueChange(value)}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  const MockAppbarHeader = ({ children }) => <View>{children}</View>;
  const MockAppbarContent = ({ title }) => <Text>{title}</Text>;
  const MockAppbarBackAction = ({ onPress }) => <TouchableOpacity onPress={onPress}><Text>Back</Text></TouchableOpacity>;

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    Title: MockTitle,
    Paragraph: MockParagraph,
    FAB: MockFAB,
    Card: MockCard,
    Text: ({ children, style }) => <Text style={style}>{children}</Text>,
    Button: MockButton,
    TextInput: MockTextInput,
    RadioButton: { Group: MockRadioButtonGroup, Item: MockRadioButtonItem },
    Appbar: { Header: MockAppbarHeader, Content: MockAppbarContent, BackAction: MockAppbarBackAction },
    HelperText: ({ children }) => <Text>{children}</Text>,
  };
});
