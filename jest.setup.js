import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn()
    })),
    useRoute: jest.fn(() => ({
      params: {}
    }))
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
    })
  };
});

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock React Native Paper specific elements
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  const actualPaper = jest.requireActual('react-native-paper');

  const MockCardTitle = Object.assign(
    ({ title, subtitle, right }) => (
      <View testID="card-title-mock">
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        {right && right()}
      </View>
    ),
    { displayName: 'Card.Title' }
  );

  const MockCard = Object.assign(
    ({ children, onPress, testID }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        {children}
      </TouchableOpacity>
    ),
    {
      Title: MockCardTitle,
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
    }
  );

  const MockRadioButtonGroup = ({ children, onValueChange, value }) => {
    return (
      <View>
        {React.Children.map(children, child =>
          React.cloneElement(child, { onValueChange, selectedValue: value })
        )}
      </View>
    );
  };

  const MockRadioButtonItem = ({ label, value, selectedValue, onValueChange }) => (
    <TouchableOpacity onPress={() => onValueChange && onValueChange(value)}>
      <Text>{label}</Text>
      <Text>{selectedValue === value ? 'checked' : 'unchecked'}</Text>
    </TouchableOpacity>
  );

  const MockRadioButton = Object.assign(() => <View />, {
    Group: MockRadioButtonGroup,
    Item: MockRadioButtonItem
  });

  return {
    ...actualPaper,
    Card: MockCard,
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    Text: ({ children }) => <Text>{children}</Text>,
    TextInput: (props) => <TextInput {...props} />,
    Button: ({ children, onPress, testID }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
    IconButton: ({ onPress, testID, icon }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>{icon}</Text>
      </TouchableOpacity>
    ),
    FAB: ({ onPress, testID, icon }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>{icon}</Text>
      </TouchableOpacity>
    ),
    RadioButton: MockRadioButton,
  };
});
