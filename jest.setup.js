import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

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

// Mock react-native-paper components properly
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput: RNTextInput, TouchableOpacity } = require('react-native');

  const PaperCard = Object.assign((props) => <TouchableOpacity testID={props.testID} onPress={props.onPress}><View>{props.children}</View></TouchableOpacity>, {
    Title: (props) => (
      <View>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        {props.right && props.right()}
        {props.left && props.left()}
      </View>
    ),
    Content: (props) => <View>{props.children}</View>,
    Actions: (props) => <View>{props.children}</View>,
  });

  const PaperRadioButton = Object.assign((props) => {
    return (
      <TouchableOpacity testID={props.testID} onPress={() => props.onPress && props.onPress(props.value)}>
        <Text>{props.value}</Text>
      </TouchableOpacity>
    );
  }, {
    Group: (props) => (
      <View>
        {React.Children.map(props.children, child =>
          React.cloneElement(child, {
            onValueChange: props.onValueChange,
            selectedValue: props.value
          })
        )}
      </View>
    ),
    Item: (props) => {
      return (
        <TouchableOpacity
          testID={props.testID || `radio-item-${props.value}`}
          onPress={() => props.onValueChange && props.onValueChange(props.value)}
        >
          <Text>{props.label}</Text>
          <Text>{props.selectedValue === props.value ? 'selected' : 'unselected'}</Text>
        </TouchableOpacity>
      )
    }
  });

  return {
    ...jest.requireActual('react-native-paper'),
    Card: PaperCard,
    IconButton: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.icon}</Text>
      </TouchableOpacity>
    ),
    FAB: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.icon}</Text>
      </TouchableOpacity>
    ),
    TextInput: (props) => (
      <RNTextInput
        {...props}
        onChangeText={props.onChangeText}
        value={props.value}
        testID={props.testID}
      />
    ),
    Button: (props) => (
      <TouchableOpacity testID={props.testID} onPress={props.onPress}>
        <Text>{props.children}</Text>
      </TouchableOpacity>
    ),
    Text: (props) => <Text testID={props.testID}>{props.children}</Text>,
    Title: (props) => <Text testID={props.testID}>{props.children}</Text>,
    Paragraph: (props) => <Text testID={props.testID}>{props.children}</Text>,
    RadioButton: PaperRadioButton,
    Provider: ({ children }) => <>{children}</>,
  };
});

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
      params: {}
    }))
  };
});

jest.mock('expo-status-bar', () => {
  return {
    StatusBar: () => null
  };
});
