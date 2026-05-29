import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    },
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'test-uuid-1234')
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const { View, TouchableOpacity } = require('react-native');
  return {
    ...actual,
    Card: Object.assign(({ children, onPress }) => {
      return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
    }, {
      Content: ({ children }) => <View>{children}</View>,
      Title: actual.Card.Title,
      Actions: actual.Card.Actions,
      Cover: actual.Card.Cover,
    }),
    RadioButton: Object.assign(({ children }) => <View>{children}</View>, {
      Group: ({ children, onValueChange, value }) => <View>{children}</View>,
      Item: ({ label, value }) => <View />
    })
  };
});
