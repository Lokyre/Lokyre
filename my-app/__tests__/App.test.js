import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText } = render(<App />);
    // The HomeScreen title should be rendered inside the App structure
    expect(getAllByText(/Total deudas:/i).length).toBeGreaterThan(0);
  });
});
