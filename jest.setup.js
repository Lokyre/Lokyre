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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
    useRoute: jest.fn(() => ({ params: {} })),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />,
    }),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput } = require('react-native');

  const MockTitle = (props) => <Text>{props.children}</Text>;
  const MockParagraph = (props) => <Text>{props.children}</Text>;
  const MockText = (props) => <Text>{props.children}</Text>;
  const MockButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );
  const MockFAB = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );
  const MockIconButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.icon}</Text>
    </TouchableOpacity>
  );
  const MockTextInput = (props) => <RNTextInput {...props} />;

  const MockCard = Object.assign(
    (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    ),
    {
      Content: ({ children }) => <View>{children}</View>,
      Title: ({ title, subtitle, right, left }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {right && right()}
          {left && left()}
        </View>
      ),
    }
  );

  const MockRadioButton = Object.assign(
    (props) => (
      <TouchableOpacity testID={props.testID} onPress={() => props.onValueChange?.(props.value)}>
        <Text>{props.value}</Text>
      </TouchableOpacity>
    ),
    {
      Group: (props) => {
        return (
          <View>
            {React.Children.map(props.children, child =>
              React.cloneElement(child, {
                onValueChange: props.onValueChange,
                selectedValue: props.value
              })
            )}
          </View>
        );
      }
    }
  );

  const MockChip = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    Title: MockTitle,
    Paragraph: MockParagraph,
    Text: MockText,
    Button: MockButton,
    FAB: MockFAB,
    IconButton: MockIconButton,
    TextInput: MockTextInput,
    Card: MockCard,
    RadioButton: MockRadioButton,
    Chip: MockChip,
    Divider: () => <View />,
  };
});
