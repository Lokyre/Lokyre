import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

jest.useFakeTimers();

import { act } from '@testing-library/react-native';

describe('App', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Total a pagar')).toBeTruthy();
  });
});
