import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const mockSafeAreaContext = React.createContext(inset);
  return {
    SafeAreaProvider: ({ children }) => React.createElement(mockSafeAreaContext.Provider, { value: inset }, children),
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaContext: mockSafeAreaContext,
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
    initialWindowMetrics: {
      insets: inset,
      frame: { x: 0, y: 0, width: 390, height: 844 },
    },
  };
});

jest.mock('react-native-get-random-values', () => ({}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }) => <>{children}</>,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});
jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children, component: Component }) => {
        if (Component) return <Component navigation={{navigate: jest.fn()}} route={{params: {debt: {amount: 10, isPaid: false}} }}/>;
        return <>{children}</>;
      },
    }),
  };
});
