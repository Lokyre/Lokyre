import React, { useContext } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text, View, Button } from 'react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ name: 'Test Debt', amount: 100, category: 'persona' })}
      />
      {debts.length > 0 && (
        <>
          <Button
            testID="update-btn"
            title="Update"
            onPress={() => updateDebt(debts[0].id, { name: 'Updated Debt', amount: 200 })}
          />
          <Button testID="delete-btn" title="Delete" onPress={() => deleteDebt(debts[0].id)} />
          <Text testID="debt-name">{debts[0].name}</Text>
        </>
      )}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', name: 'Existing Debt', amount: 50 }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    }, { timeout: 10000 });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    }, { timeout: 10000 });

    const { fireEvent } = require('@testing-library/react-native');
    act(() => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    }, { timeout: 10000 });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
