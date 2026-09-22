import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
  });

  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Deudas Pendientes')).toBeTruthy();
  });
});
