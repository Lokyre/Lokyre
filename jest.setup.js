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
    SafeAreaView: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
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
        Screen: ({ component: Component, name }) => (
          <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />
        ),
      };
    },
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput } = require('react-native');

  const Provider = ({ children }) => <View>{children}</View>;

  const CardTitle = (props) => (
    <View testID={props.testID}>
      <Text>{props.title}</Text>
      {props.subtitle && <Text>{props.subtitle}</Text>}
      {props.left && props.left()}
      {props.right && props.right()}
    </View>
  );

  const Card = Object.assign(
    (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    ),
    {
      Title: CardTitle,
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
    }
  );

  const IconButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.icon}</Text>
    </TouchableOpacity>
  );

  const FAB = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.icon}</Text>
    </TouchableOpacity>
  );

  const Button = (props) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );

  const TextInput = (props) => (
    <RNTextInput
      {...props}
      testID={props.testID}
      onChangeText={props.onChangeText}
      value={props.value}
    />
  );

  const RadioButton = (props) => (
    <TouchableOpacity testID={props.testID} onPress={() => props.onPress && props.onPress(props.value)}>
      <Text>{props.value}</Text>
    </TouchableOpacity>
  );

  RadioButton.Group = (props) => (
    <View testID={props.testID}>
      {React.Children.map(props.children, child => {
        return React.cloneElement(child, {
          onValueChange: props.onValueChange,
          selectedValue: props.value
        });
      })}
    </View>
  );

  RadioButton.Item = (props) => {
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
    Provider,
    Card,
    IconButton,
    FAB,
    Button,
    TextInput,
    Text,
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    Divider: () => <View />,
    RadioButton,
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => {
    const { Text } = require('react-native');
    return <Text>Ionicons</Text>;
  },
  MaterialCommunityIcons: () => {
    const { Text } = require('react-native');
    return <Text>MaterialCommunityIcons</Text>;
  },
}));
