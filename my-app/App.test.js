import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from './App';

describe('App Component', () => {
  it('renders correctly without crashing', async () => {
    const component = render(<App />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(component.toJSON()).toBeTruthy();
  });
});
