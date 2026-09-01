import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App', () => {
  it('renders correctly', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByText, getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByText('Deuda Total Pendiente:')).toBeTruthy();
    });

    expect(getByTestId('fab-add-debt')).toBeTruthy();
  });
});