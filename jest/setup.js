import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) =>
        children({ left: 0, right: 0, bottom: 0, top: 0 }),
    },
    useSafeAreaInsets: jest.fn(() => ({ left: 0, right: 0, bottom: 0, top: 0 })),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
  };
});
