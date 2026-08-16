import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
  };
});

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

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const Card = Object.assign(
    (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}>{props.children}</TouchableOpacity>,
    {
      Title: (props) => (
        <View>
          <Text>{props.title}</Text>
          {props.subtitle && <Text>{props.subtitle}</Text>}
          {props.left && props.left()}
          {props.right && props.right()}
        </View>
      ),
      Content: (props) => <View>{props.children}</View>,
      Actions: (props) => <View>{props.children}</View>,
    }
  );

  const RadioButton = Object.assign(
    (props) => (
      <TouchableOpacity
        testID={props.testID}
        onPress={() => props.onValueChange && props.onValueChange(props.value)}
      >
        <Text>{props.value}</Text>
      </TouchableOpacity>
    ),
    {
      Group: (props) => {
        const renderChildren = (children) => {
          return React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;

            // if it is a RadioButton, clone with onValueChange
            if (child.type === RadioButton) {
              return React.cloneElement(child, {
                onValueChange: props.onValueChange,
                selectedValue: props.value,
              });
            }

            // recurse if it's a View or other wrapper
            if (child.props && child.props.children) {
              return React.cloneElement(child, {
                children: renderChildren(child.props.children)
              });
            }
            return child;
          });
        };

        return (
          <View testID={props.testID}>
            {renderChildren(props.children)}
          </View>
        );
      },
    }
  );

  return {
    Provider: ({ children }) => <View>{children}</View>,
    useTheme: () => ({ colors: { primary: 'blue', error: 'red', background: 'white' } }),
    FAB: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>FAB</Text></TouchableOpacity>,
    IconButton: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>Icon</Text></TouchableOpacity>,
    Button: (props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><Text>{props.children}</Text></TouchableOpacity>,
    Card,
    RadioButton,
    Surface: (props) => <View {...props} />,
    Text: (props) => <Text {...props} />,
    TextInput: (props) => <TextInput {...props} />,
  };
});
