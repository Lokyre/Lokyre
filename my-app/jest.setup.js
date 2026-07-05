import '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

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
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{children}</View>,
      Screen: ({ children }) => <View>{children}</View>,
    }),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const Paper = jest.requireActual('react-native-paper');

  return {
    ...Paper,
    Card: Object.assign(({ children }) => <View>{children}</View>, {
      Title: ({ title, subtitle, right }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {right && right({})}
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
    }),
    RadioButton: Object.assign(({ value }) => <View testID={`radio-${value}`} />, {
      Group: ({ children }) => <View>{children}</View>,
    }),
    FAB: ({ testID, onPress }) => <TouchableOpacity testID={testID} onPress={onPress}><Text>FAB</Text></TouchableOpacity>,
    IconButton: ({ icon, onPress, testID }) => <TouchableOpacity testID={testID} onPress={onPress}><Text>{icon}</Text></TouchableOpacity>,
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
  };
});

// Explicitly avoid mocking NativeAnimatedHelper which causes errors in recent RN versions
