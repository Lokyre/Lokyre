import React, { useContext, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from '../src/DebtContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

const TestComponent = () => {
  const { debts, addDebt, isLoaded } = useContext(DebtContext);

  return (
    <View>
      <Text testID="loaded">{isLoaded ? 'yes' : 'no'}</Text>
      <Text testID="debts-count">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({
          title: 'Test Debt',
          amount: 100,
          type: 'Crédito',
          dueDate: '01/01/2025',
          description: 'Testing',
        })}
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts and adds a new debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    await waitFor(() => {
      expect(getByTestId('loaded').props.children).toBe('yes');
    });

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
