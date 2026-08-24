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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
    useRoute: jest.fn(() => ({ params: {} })),
    NavigationContainer: ({ children }) => {
      const React = require('react');
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => {
      const React = require('react');
      const { View } = require('react-native');
      return {
        Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
        Screen: ({ component: Component }) => (
          <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
        ),
      };
    },
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  return {
    Provider: ({ children }) => <View>{children}</View>,
    Card: Object.assign(
      (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}>{props.children}</TouchableOpacity>,
      {
        Title: (props) => (
          <View>
            <Text>{props.title}</Text>
            <Text>{props.subtitle}</Text>
            {props.right && props.right({ testID: props.testID ? `${props.testID}-right` : 'card-right-icon' })}
          </View>
        ),
        Content: (props) => <View>{props.children}</View>,
      }
    ),
    Title: (props) => <Text>{props.children}</Text>,
    Paragraph: (props) => <Text>{props.children}</Text>,
    Text: (props) => <Text style={props.style}>{props.children}</Text>,
    TextInput: (props) => <TextInput {...props} />,
    Button: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>{props.children}</Text></TouchableOpacity>,
    IconButton: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>{props.icon}</Text></TouchableOpacity>,
    FAB: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>{props.icon}</Text></TouchableOpacity>,
    ActivityIndicator: () => <View />,
    RadioButton: Object.assign(
      (props) => <View />,
      {
        Group: (props) => {
          return (
            <View>
              {React.Children.map(props.children, child =>
                React.cloneElement(child, {
                  onValueChange: props.onValueChange,
                  selectedValue: props.value,
                })
              )}
            </View>
          );
        },
        Item: (props) => (
          <TouchableOpacity
            testID={props.testID}
            onPress={() => props.onValueChange && props.onValueChange(props.value)}
          >
            <Text>{props.label}</Text>
          </TouchableOpacity>
        ),
      }
    ),
  };
});

jest.spyOn(require('react-native').Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0) {
    const defaultAction = buttons.find(b => b.style === 'destructive') || buttons[0];
    if (defaultAction && defaultAction.onPress) {
      defaultAction.onPress();
    }
  }
});
