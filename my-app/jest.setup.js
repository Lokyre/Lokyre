import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
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

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
  useRoute: jest.fn(() => ({ params: {} })),
  NavigationContainer: ({ children }) => {
    const React = require('react');
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

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

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput: RNTextInput, TouchableOpacity } = require('react-native');

  const Card = Object.assign((props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><View>{props.children}</View></TouchableOpacity>, {
    Title: (props) => (
      <View>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        {props.right && props.right()}
        {props.left && props.left()}
      </View>
    ),
    Content: ({ children }) => <View>{children}</View>,
    Actions: ({ children }) => <View>{children}</View>,
  });

  const RadioButton = Object.assign(({ testID, onPress }) => <TouchableOpacity testID={testID} onPress={onPress}><View /></TouchableOpacity>, {
    Group: ({ children }) => <View>{children}</View>,
    Item: ({ testID, value }) => <View testID={testID}><Text>{value}</Text></View>,
  });

  return {
    ...jest.requireActual('react-native-paper'),
    Provider: ({ children }) => <View>{children}</View>,
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    Text: ({ children }) => <Text>{children}</Text>,
    Button: ({ children, testID, onPress }) => <TouchableOpacity testID={testID} onPress={onPress}><Text>{children}</Text></TouchableOpacity>,
    TextInput: (props) => <RNTextInput {...props} />,
    FAB: ({ testID, onPress }) => <TouchableOpacity testID={testID || 'fab'} onPress={onPress}><View /></TouchableOpacity>,
    IconButton: ({ testID, onPress }) => <TouchableOpacity testID={testID} onPress={onPress}><View /></TouchableOpacity>,
    ActivityIndicator: () => <View />,
    Card,
    RadioButton,
  };
});
