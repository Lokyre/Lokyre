import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
    useRoute: jest.fn(() => ({ params: {} })),
    NavigationContainer: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => {
        const { View } = require('react-native');
        const React = require('react');
        return <View>{React.Children.toArray(children)}</View>;
      },
      Screen: ({ component: Component }) => {
        const React = require('react');
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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const CardTitle = (props) => (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.right && props.right()}
      {props.left && props.left()}
    </View>
  );

  const Card = Object.assign(
    (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}>{props.children}</TouchableOpacity>,
    {
      Content: (props) => <View>{props.children}</View>,
      Actions: (props) => <View>{props.children}</View>,
      Cover: (props) => <View>{props.children}</View>,
      Title: CardTitle,
    }
  );

  const SegmentedButtons = (props) => {
    return (
      <View style={props.style} testID="segmented-buttons">
        {props.buttons.map(btn => (
          <TouchableOpacity
            key={btn.value}
            onPress={() => props.onValueChange(btn.value)}
            testID={`seg-btn-${btn.value}`}
          >
            <Text>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const MockProvider = ({ children }) => <View>{children}</View>;

  return {
    ...jest.requireActual('react-native-paper'),
    Card,
    SegmentedButtons,
    Provider: MockProvider,
    Title: (props) => <Text {...props}>{props.children}</Text>,
    Paragraph: (props) => <Text {...props}>{props.children}</Text>,
    Button: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>{props.children}</Text></TouchableOpacity>,
    FAB: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>FAB</Text></TouchableOpacity>,
    Text: (props) => <Text {...props}>{props.children}</Text>,
    TextInput: (props) => <TextInput testID={props.testID} value={props.value} onChangeText={props.onChangeText} />,
    Divider: () => <View />,
  };
});
