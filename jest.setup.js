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
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const Paper = jest.requireActual('react-native-paper');

  const MockCard = Object.assign(
    ({ children, testID, onPress, style }) => (
      <TouchableOpacity testID={testID} onPress={onPress} style={style}>
        {children}
      </TouchableOpacity>
    ),
    {
      Title: ({ title, subtitle, right, left }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {left && left()}
          {right && right({ size: 24 })}
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
    }
  );

  const MockRadioButtonGroup = ({ children, onValueChange, value }) => {
    return React.Children.map(children, (child) => {
      if (child.type.name === 'View') { // assuming radio items wrapped in View
        return React.cloneElement(child, {
          children: React.Children.map(child.props.children, c => React.cloneElement(c, { onValueChange, selectedValue: value }))
        });
      }
      return React.cloneElement(child, { onValueChange, selectedValue: value });
    });
  };

  const MockRadioButtonItem = ({ label, value, selectedValue, onValueChange, testID }) => (
    <TouchableOpacity testID={testID} onPress={() => onValueChange(value)}>
      <Text>{label}</Text>
      <Text>{value === selectedValue ? 'selected' : 'unselected'}</Text>
    </TouchableOpacity>
  );

  const MockIconButton = ({ icon, onPress, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>{icon}</Text>
    </TouchableOpacity>
  );

  const MockFAB = ({ icon, onPress, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>{icon}</Text>
    </TouchableOpacity>
  );

  return {
    ...Paper,
    Card: MockCard,
    IconButton: MockIconButton,
    FAB: MockFAB,
    RadioButton: { Group: MockRadioButtonGroup, Item: MockRadioButtonItem },
    TextInput: (props) => <TextInput {...props} />,
    Button: ({ children, onPress, testID }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
    Text: ({ children, testID, style }) => <Text testID={testID} style={style}>{children}</Text>,
    Chip: ({ children, style }) => <View style={style}><Text>{children}</Text></View>,
  };
});
