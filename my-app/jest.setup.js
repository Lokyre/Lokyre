import '@testing-library/react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

// Mock react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({ params: {} })),
  };
});

// Mock react-native-paper components to avoid test errors with sub-components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  const Paper = jest.requireActual('react-native-paper');

  const MockTitle = (props) => <Text {...props}>{props.children}</Text>;
  const MockParagraph = (props) => <Text {...props}>{props.children}</Text>;
  const MockText = (props) => <Text {...props}>{props.children}</Text>;

  const MockCardTitle = (props) => (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.left && props.left({})}
      {props.right && props.right({})}
    </View>
  );

  const MockCard = Object.assign((props) => <TouchableOpacity {...props}><View>{props.children}</View></TouchableOpacity>, {
    Title: MockCardTitle,
    Content: (props) => <View {...props}>{props.children}</View>,
    Actions: (props) => <View {...props}>{props.children}</View>,
  });

  const MockIconButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>IconButton</Text>
    </TouchableOpacity>
  );

  const MockFAB = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );

  const MockRadioButtonItem = (props) => (
    <TouchableOpacity onPress={() => {}} testID={props.testID}>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );

  const MockRadioButtonGroup = (props) => <View {...props}>{props.children}</View>;

  const MockRadioButton = Object.assign((props) => <TouchableOpacity {...props} />, {
    Item: MockRadioButtonItem,
    Group: MockRadioButtonGroup,
  });

  const MockTextInput = (props) => <TextInput {...props} />;
  const MockButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );
  const MockActivityIndicator = (props) => <View {...props} testID="activity-indicator"><Text>ActivityIndicator</Text></View>;


  return {
    ...Paper,
    Card: MockCard,
    Title: MockTitle,
    Paragraph: MockParagraph,
    Text: MockText,
    IconButton: MockIconButton,
    FAB: MockFAB,
    RadioButton: MockRadioButton,
    TextInput: MockTextInput,
    Button: MockButton,
    ActivityIndicator: MockActivityIndicator,
  };
});
