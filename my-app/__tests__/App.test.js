import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders correctly', async () => {
    let component;

    component = render(<App />);
    // Wait for the async loading in the DebtContext
    await act(async () => {
      await Promise.resolve();
    });

    expect(component).toBeTruthy();
  });
});
