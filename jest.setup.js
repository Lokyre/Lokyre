import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const MockTitle = (props) => <Text {...props}>{props.children}</Text>;
  const MockParagraph = (props) => <Text {...props}>{props.children}</Text>;
  const MockButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );
  const MockFAB = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );
  const MockIconButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>Icon</Text>
    </TouchableOpacity>
  );
  const MockTextInput = (props) => <TextInput {...props} />;

  const MockCard = Object.assign(
    (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><View>{props.children}</View></TouchableOpacity>,
    {
      Title: (props) => (
        <View>
          <Text>{props.title}</Text>
          <Text>{props.subtitle}</Text>
          {props.right && props.right({})}
        </View>
      ),
      Content: (props) => <View>{props.children}</View>,
    }
  );

  const MockRadioButtonGroup = (props) => {
    return (
      <View>
        {React.Children.map(props.children, (child) =>
          React.cloneElement(child, {
            onValueChange: props.onValueChange,
            selectedValue: props.value,
          })
        )}
      </View>
    );
  };

  const MockRadioButtonItem = (props) => {
    return (
      <TouchableOpacity
        testID={props.testID}
        onPress={() => props.onValueChange && props.onValueChange(props.value)}
      >
        <Text>{props.label}</Text>
      </TouchableOpacity>
    );
  };

  return {
    ...jest.requireActual('react-native-paper'),
    Title: MockTitle,
    Paragraph: MockParagraph,
    Button: MockButton,
    FAB: MockFAB,
    IconButton: MockIconButton,
    TextInput: MockTextInput,
    Card: MockCard,
    Text: (props) => <Text {...props}>{props.children}</Text>,
    RadioButton: {
      Group: MockRadioButtonGroup,
      Item: MockRadioButtonItem,
    },
    useTheme: () => ({ colors: { error: 'red', primary: 'blue' } }),
    Provider: ({ children }) => <View>{children}</View>,
  };
});
