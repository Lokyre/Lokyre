import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders correctly', async () => {
    let tree;
    tree = render(<App />);
    await act(async () => {});

    expect(tree.toJSON()).toBeTruthy();
  });
});
