import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }),
    },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  const RealPaper = jest.requireActual('react-native-paper');

  const MockTitle = (props) => <Text {...props}>{props.children}</Text>;
  const MockSubtitle = (props) => <Text {...props}>{props.children}</Text>;

  const MockCardTitle = (props) => (
    <View testID={props.testID}>
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.left && props.left()}
      {props.right && props.right()}
    </View>
  );

  const MockCard = Object.assign((props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}>{props.children}</TouchableOpacity>, {
    Title: MockCardTitle,
    Content: (props) => <View {...props} />,
    Actions: (props) => <View {...props} />,
  });

  const MockFAB = (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>FAB</Text></TouchableOpacity>;
  const MockIconButton = (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>Icon</Text></TouchableOpacity>;

  return {
    ...RealPaper,
    Card: MockCard,
    FAB: MockFAB,
    IconButton: MockIconButton,
    Title: MockTitle,
    Paragraph: (props) => <Text {...props} />,
    TextInput: (props) => <TextInput {...props} />,
    Button: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>{props.children}</Text></TouchableOpacity>,
    Text: (props) => <Text {...props} />,
  };
});

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
  useRoute: jest.fn(() => ({
    params: {},
  })),
}));

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => (
        <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
      ),
    }),
  };
});
