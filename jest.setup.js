import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
    useRoute: jest.fn(() => ({ params: {} })),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />
    })
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const MockTitle = (props) => <Text>{props.children}</Text>;
  const MockSubtitle = (props) => <Text>{props.children}</Text>;

  const Card = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      {props.children}
    </TouchableOpacity>
  );

  Card.Title = (props) => (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.left && props.left()}
      {props.right && props.right()}
    </View>
  );
  Card.Content = (props) => <View>{props.children}</View>;
  Card.Actions = (props) => <View>{props.children}</View>;

  const RadioGroup = (props) => {
    return React.Children.map(props.children, (child) => {
      return React.cloneElement(child, {
        onValueChange: props.onValueChange,
        selectedValue: props.value,
      });
    });
  };

  const RadioButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={() => props.onValueChange(props.value)}>
      <Text>{props.value}</Text>
    </TouchableOpacity>
  );
  Object.assign(RadioButton, { Group: RadioGroup });

  const IconButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.icon}</Text>
    </TouchableOpacity>
  );

  const FAB = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.icon}</Text>
    </TouchableOpacity>
  );

  return {
    ...jest.requireActual('react-native-paper'),
    Card,
    IconButton,
    FAB,
    RadioButton,
    TextInput: (props) => <TextInput {...props} />,
    Button: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.children}</Text>
      </TouchableOpacity>
    ),
    Text: (props) => <Text {...props} />,
    Title: (props) => <Text {...props} />,
    Paragraph: (props) => <Text {...props} />,
  };
});
