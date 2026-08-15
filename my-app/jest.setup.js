import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

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

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const CardTitle = (props) => (
    <View testID="card-title">
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.left && props.left({ testID: 'card-title-left' })}
      {props.right && props.right({ testID: 'card-title-right' })}
    </View>
  );

  const Card = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress} style={props.style}>
      {props.children}
    </TouchableOpacity>
  );
  Card.Title = CardTitle;
  Card.Content = ({ children }) => <View>{children}</View>;

  const RadioGroup = ({ children }) => <View>{children}</View>;
  const RadioButtonMock = (props) => (
    <TouchableOpacity testID={props.testID} onPress={() => props.onPress && props.onPress(props.value)}>
      <Text>{props.value}</Text>
    </TouchableOpacity>
  );
  RadioButtonMock.Group = RadioGroup;

  return {
    Provider: ({ children }) => <View>{children}</View>,
    useTheme: () => ({ colors: { primary: 'blue' } }),
    FAB: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>FAB</Text>
      </TouchableOpacity>
    ),
    Card,
    Title: ({ children, style }) => <Text style={style}>{children}</Text>,
    Paragraph: ({ children, style }) => <Text style={style}>{children}</Text>,
    Text: ({ children, style }) => <Text style={style}>{children}</Text>,
    IconButton: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>IconButton-{props.icon}</Text>
      </TouchableOpacity>
    ),
    TextInput: (props) => <TextInput {...props} testID={props.testID} />,
    Button: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.children}</Text>
      </TouchableOpacity>
    ),
    RadioButton: RadioButtonMock,
  };
});
