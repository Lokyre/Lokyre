import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import React from 'react';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'test-uuid')
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <View {...props} testID={props.testID || 'icon'} />,
    Ionicons: (props) => <View {...props} testID={props.testID || 'icon'} />
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return (props) => <View {...props} testID={props.testID || 'icon'} />;
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) }
  };
});

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual('react-native-paper');
  const React = require('react');
  const { View } = require('react-native');

  const MockedCardContent = ({ children }) => <View>{children}</View>;
  const MockedCardTitle = ({ title, subtitle, right, left }) => (
    <View>
      {left && left({ size: 24 })}
      {title && <View testID="card-title">{title}</View>}
      {subtitle && <View testID="card-subtitle">{subtitle}</View>}
      {right && right({ size: 24 })}
    </View>
  );

  const MockedCard = ({ children, onPress }) => <View testID="card" onTouchEnd={onPress}>{children}</View>;
  MockedCard.Content = MockedCardContent;
  MockedCard.Title = MockedCardTitle;

  return {
    ...RealModule,
    Card: MockedCard,
  };
});