import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Card = ({ children }) => <View>{children}</View>;
  Card.Content = ({ children }) => <View>{children}</View>;
  return {
    PaperProvider: ({ children }) => <View>{children}</View>,
    Surface: ({ children }) => <View>{children}</View>,
    Text: ({ children }) => <View>{children}</View>,
    Card,
    Title: ({ children }) => <View>{children}</View>,
    Paragraph: ({ children }) => <View>{children}</View>,
    FAB: () => <View />,
    Button: ({ children }) => <View>{children}</View>,
    TextInput: () => <View />,
    RadioButton: {
      Group: ({ children }) => <View>{children}</View>,
      Item: () => <View />
    },
    useTheme: () => ({ colors: {} })
  };
});

describe('App', () => {
  it('renders correctly', () => {
    let component;
    component = render(<App />);
    expect(component).toBeTruthy();
  });
});
