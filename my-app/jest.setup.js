import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import { View, Text } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => {
        const React = require('react');
        const { View } = require('react-native');
        return <View>{React.Children.toArray(children)}</View>;
      },
      Screen: ({ component: Component }) => {
        const React = require('react');
        return <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />;
      },
    }),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
  SafeAreaInsetsContext: {
    Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
  },
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

// Mock React Native Paper components correctly for text queries
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const MockTitle = ({ children, testID }) => <Text testID={testID}>{children}</Text>;
  const MockParagraph = ({ children, testID }) => <Text testID={testID}>{children}</Text>;
  const MockCardContent = ({ children }) => <View>{children}</View>;
  const MockCardActions = ({ children }) => <View>{children}</View>;
  const MockCard = ({ children, onPress, testID }) => (
    <TouchableOpacity onPress={onPress} testID={testID}>
      {children}
    </TouchableOpacity>
  );
  MockCard.Content = MockCardContent;
  MockCard.Title = MockTitle;
  MockCard.Actions = MockCardActions;

  const MockButton = ({ children, onPress, testID }) => (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );

  const MockFAB = ({ onPress, testID }) => (
    <TouchableOpacity onPress={onPress} testID={testID || 'fab'}>
      <Text>FAB</Text>
    </TouchableOpacity>
  );

  const MockTextInput = (props) => <TextInput {...props} />;

  const MockRadioButton = ({ testID, value }) => <View testID={testID} value={value} />;
  MockRadioButton.Group = ({ children, onValueChange, value }) => <View value={value}>{children}</View>;

  const MockActivityIndicator = (props) => <View {...props} testID="activity-indicator" />;

  return {
    ...jest.requireActual('react-native-paper'),
    Card: MockCard,
    Title: MockTitle,
    Paragraph: MockParagraph,
    Button: MockButton,
    FAB: MockFAB,
    TextInput: MockTextInput,
    RadioButton: MockRadioButton,
    ActivityIndicator: MockActivityIndicator,
    PaperProvider: ({ children }) => <View>{children}</View>,
    Text: ({ children, style }) => <Text style={style}>{children}</Text>,
  };
});

// Mock Icons
jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => () => {
  const { View } = require('react-native');
  return <View />;
});
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => {
    const { View } = require('react-native');
    return <View />;
  },
}));

// Mock Alert
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 1) {
    // Automatically press the "destructive" (Eliminar) button for testing
    const deleteButton = buttons.find(b => b.style === 'destructive');
    if (deleteButton && deleteButton.onPress) {
      deleteButton.onPress();
    }
  }
});
