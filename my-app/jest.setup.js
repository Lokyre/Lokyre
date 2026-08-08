import 'react-native-gesture-handler/jestSetup';
import '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

// Mock react-native-paper's sub-components if needed for tests
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } = require('react-native');
  const ActualPaper = jest.requireActual('react-native-paper');

  const MockCard = Object.assign(
    ({ children, onPress, testID }) => (
        <TouchableOpacity onPress={onPress} testID={testID}>
            {children}
        </TouchableOpacity>
    ),
    {
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
      Title: ({ title, subtitle, right }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {right && right()}
        </View>
      ),
    }
  );

  const MockRadioButton = Object.assign(
      ({ value, onValueChange, children }) => <View>{children}</View>,
      {
          Group: ({ onValueChange, value, children }) => <View>{children}</View>,
          Item: ({ label, value, testID }) => <View testID={testID}><Text>{label}</Text></View>
      }
  );

  return {
    ...ActualPaper,
    Card: MockCard,
    RadioButton: MockRadioButton,
    IconButton: ({ onPress, testID, icon }) => (
      <TouchableOpacity onPress={onPress} testID={testID}>
        <Text>{icon}</Text>
      </TouchableOpacity>
    ),
    FAB: ({ onPress, testID, label }) => (
      <TouchableOpacity onPress={onPress} testID={testID}>
         <Text>{label}</Text>
      </TouchableOpacity>
    ),
  };
});
