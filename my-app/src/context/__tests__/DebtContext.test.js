import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtContext, DebtProvider } from '../DebtContext';
import { Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const { debts, addDebt, deleteDebt } = React.useContext(DebtContext);

    return (
      <>
        <Text testID="debts-length">{debts.length.toString()}</Text>
        <Button
          testID="add-btn"
          title="Add"
          onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'Tarjeta', dueDate: '2023-12-31' })}
        />
        <Button
          testID="delete-btn"
          title="Delete"
          onPress={() => deleteDebt('test-uuid-1234')}
        />
      </>
    );
  };

  it('loads debts from AsyncStorage on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify([{ id: '1', title: 'Debt 1', amount: 50, isPaid: false }])
    );

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe('1');
    });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe('1');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts',
      JSON.stringify([
        { title: 'New Debt', amount: 100, type: 'Tarjeta', dueDate: '2023-12-31', id: 'test-uuid-1234', isPaid: false },
      ])
    );
  });
});
