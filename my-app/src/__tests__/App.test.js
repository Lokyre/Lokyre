import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from '../../App';

describe('App', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<App />);

    await act(async () => { await Promise.resolve(); });

    // It should render "Mis Deudas" which is the initial route title
    // But since our mock stack navigator renders the children, it might render the HomeScreen text
    expect(getByText('Todas')).toBeTruthy();
    expect(getByText('Pendientes')).toBeTruthy();
  });
});
