import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({ params: {} })),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component, name }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />,
    }),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const Paper = jest.requireActual('react-native-paper');

  return {
    ...Paper,
    Card: Object.assign(({ children, testID, onPress }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        {children}
      </TouchableOpacity>
    ), {
      Title: ({ title, subtitle, left, right }) => (
        <View>
          <Text>{title}</Text>
          {subtitle && <Text>{subtitle}</Text>}
          {left && left()}
          {right && right()}
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
    }),
    RadioButton: Object.assign(({ value, status, onPress }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{value}</Text>
      </TouchableOpacity>
    ), {
      Group: ({ onValueChange, value, children }) => (
        <View>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              status: child.props.value === value ? 'checked' : 'unchecked',
              onPress: () => onValueChange(child.props.value),
            })
          )}
        </View>
      ),
      Item: ({ label, value, status, onPress }) => (
        <TouchableOpacity onPress={onPress}>
          <Text>{label}</Text>
        </TouchableOpacity>
      )
    }),
    FAB: ({ testID, onPress }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>FAB</Text>
      </TouchableOpacity>
    ),
    IconButton: ({ testID, onPress }) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>Icon</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('expo-status-bar', () => {
  const React = require('react');
  return {
    __esModule: true,
    StatusBar: jest.fn(() => null),
  };
});
