import React, { useContext } from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('react-native-get-random-values', () => {});

const TestComponent = () => {
  const { debts, addDebt, loading } = useContext(DebtContext);

  if (loading) return <Text>Loading...</Text>;

  return (
    <>
      <Text testID="debts-count">{debts.length}</Text>
      <Text onPress={() => addDebt({ title: 'Test Debt', amount: 100, category: 'tarjetas' })} testID="add-btn">
        Add Debt
      </Text>
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Existing Debt' }]));

    const rendered = render(<DebtProvider><TestComponent /></DebtProvider>); const getByTestId = rendered.getByTestId; await act(async () => {});

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(AsyncStorage.getItem).toHaveBeenCalled();
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const rendered = render(<DebtProvider><TestComponent /></DebtProvider>); const getByTestId = rendered.getByTestId; await act(async () => {});

    expect(getByTestId('debts-count').props.children).toBe(0);

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
