import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => (
  { getItem: jest.fn(), setItem: jest.fn(), clear: jest.fn() })
);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
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
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
    })
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  const Paper = jest.requireActual('react-native-paper');

  const MockCardTitle = (props) => (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.right && props.right()}
      {props.left && props.left()}
    </View>
  );

  const MockCard = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      {props.children}
    </TouchableOpacity>
  );

  return {
    ...Paper,
    Card: Object.assign(MockCard, {
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
      Title: MockCardTitle,
    }),
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children, style }) => <Text style={style}>{children}</Text>,
    Chip: ({ children, style }) => <Text style={style}>{children}</Text>,
    FAB: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>FAB</Text>
      </TouchableOpacity>
    ),
    IconButton: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>IconButton</Text>
      </TouchableOpacity>
    ),
    TextInput: (props) => <TextInput {...props} />,
    Button: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    ),
    RadioButton: Object.assign((props) => (
      <TouchableOpacity testID={props.testID} onPress={() => props.onPress && props.onPress(props.value)}>
        <Text>{props.value}</Text>
      </TouchableOpacity>
    ), {
      Group: (props) => {
        return (
          <View>
            {React.Children.map(props.children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onValueChange: props.onValueChange,
                  selectedValue: props.value
                });
              }
              return child;
            })}
          </View>
        );
      }
    }),
  };
});
