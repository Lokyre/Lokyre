import React, { useContext } from 'react';
import { Text } from 'react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtContext, DebtProvider } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt } = useContext(DebtContext);
  return (
    <>
      <Text testID="debts-count">{debts.length.toString()}</Text>
      <Text testID="add-btn" onPress={() => addDebt({ id: '1', title: 'Test Debt', amount: '100' })} />
      <Text testID="update-btn" onPress={() => updateDebt({ id: '1', title: 'Test Debt Updated', amount: '100', isPaid: true })} />
      <Text testID="delete-btn" onPress={() => deleteDebt('1')} />
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Loaded Debt', amount: '50' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(getByTestId('debts-count').props.children).toBe('1');
  });

  it('adds a debt', async () => {
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

    expect(getByTestId('debts-count').props.children).toBe('1');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts',
      JSON.stringify([{ id: '1', title: 'Test Debt', amount: '100' }])
    );
  });
});
