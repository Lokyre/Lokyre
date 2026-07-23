import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
    useRoute: jest.fn(),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => {
        return <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />;
      },
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const MockTitle = (props) => <Text testID={props.testID}>{props.children}</Text>;
  const MockParagraph = (props) => <Text testID={props.testID}>{props.children}</Text>;

  const MockCardTitle = (props) => {
    return (
      <View testID={props.testID}>
        <Text testID="mock-card-title">{props.title}</Text>
        <Text testID="mock-card-subtitle">{props.subtitle}</Text>
        {props.left && props.left()}
        {props.right && props.right()}
      </View>
    );
  };

  const MockCard = Object.assign(
    (props) => <View testID={props.testID} onPress={props.onPress}>{props.children}</View>,
    {
      Content: (props) => <View>{props.children}</View>,
      Title: MockCardTitle,
      Actions: (props) => <View>{props.children}</View>,
    }
  );

  const MockButton = (props) => (
    <TouchableOpacity onPress={props.onPress} testID={props.testID}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );

  const MockIconButton = (props) => (
    <TouchableOpacity onPress={props.onPress} testID={props.testID}>
      <Text>{props.icon}</Text>
    </TouchableOpacity>
  );

  const MockRadioButtonGroup = (props) => (
    <View testID={props.testID}>{props.children}</View>
  );

  const MockRadioButton = (props) => (
    <TouchableOpacity onPress={() => props.onValueChange && props.onValueChange(props.value)} testID={props.testID}>
      <Text>{props.value}</Text>
    </TouchableOpacity>
  );

  MockRadioButton.Group = MockRadioButtonGroup;

  const MockTextInput = (props) => (
    <TextInput testID={props.testID} value={props.value} onChangeText={props.onChangeText} />
  );

  const MockFAB = (props) => (
    <TouchableOpacity onPress={props.onPress} testID={props.testID}>
       <Text>FAB</Text>
    </TouchableOpacity>
  );

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    Card: MockCard,
    Title: MockTitle,
    Paragraph: MockParagraph,
    Button: MockButton,
    IconButton: MockIconButton,
    TextInput: MockTextInput,
    RadioButton: MockRadioButton,
    FAB: MockFAB,
    ActivityIndicator: (props) => <View testID={props.testID} />,
    SegmentedButtons: (props) => {
        return (
            <View testID={props.testID}>
                {props.buttons.map(b => (
                    <TouchableOpacity key={b.value} onPress={() => props.onValueChange(b.value)}>
                        <Text>{b.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )
    },
    useTheme: () => ({ colors: { primary: 'blue' } }),
  };
});
