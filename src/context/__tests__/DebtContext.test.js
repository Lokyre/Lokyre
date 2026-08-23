import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { DebtContext, DebtProvider } from '../DebtContext';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, loading, addDebt, deleteDebt } = React.useContext(DebtContext);

  if (loading) return <Text>Loading...</Text>;

  return (
    <>
      <Text testID="debts-count">{debts.length}</Text>
      <Text
        testID="add-btn"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, category: 'Otro' })}
      >
        Add
      </Text>
      {debts.length > 0 && (
        <Text
          testID="delete-btn"
          onPress={() => deleteDebt(debts[0].id)}
        >
          Delete
        </Text>
      )}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(
      JSON.stringify([{ id: '1', title: 'Saved Debt', amount: 50, category: 'Tarjeta', date: '2023-01-01T00:00:00.000Z' }])
    ));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeNull();
    });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(JSON.stringify([])));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeNull();
    });

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
