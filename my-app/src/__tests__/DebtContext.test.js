import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import { Text } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const TestComponent = () => {
  const { debts, loading, addDebt, markAsPaid, deleteDebt } = React.useContext(DebtContext);

  return (
    <>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
      <Text testID="debts-length">{debts.length.toString()}</Text>
      <Text
        testID="add-btn"
        onPress={() => addDebt({ title: 'Test', amount: 100, type: 'Tarjeta' })}
      >
        Add
      </Text>
      {debts.length > 0 && (
        <>
          <Text
            testID="pay-btn"
            onPress={() => markAsPaid(debts[0].id, true)}
          >
            Pay
          </Text>
          <Text
            testID="delete-btn"
            onPress={() => deleteDebt(debts[0].id)}
          >
            Delete
          </Text>
        </>
      )}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('loading').props.children).toBe('false');
    expect(getByTestId('debts-length').props.children).toBe('0');
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    AsyncStorage.setItem.mockResolvedValueOnce(null);

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

    expect(getByTestId('debts-length').props.children).toBe('1');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
