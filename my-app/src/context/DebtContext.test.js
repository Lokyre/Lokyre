import React, { useContext, useEffect } from 'react';
import { render, act } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from './DebtContext';

const TestComponent = ({ action, idToToggle, idToDelete }) => {
  const { debts, addDebt, toggleDebtPaid, deleteDebt } = useContext(DebtContext);

  useEffect(() => {
    if (action === 'add') {
      addDebt({ title: 'Test Debt', amount: '100', type: 'Tarjeta', dueDate: '2024-01-01' });
    } else if (action === 'toggle' && idToToggle) {
      toggleDebtPaid(idToToggle);
    } else if (action === 'delete' && idToDelete) {
      deleteDebt(idToDelete);
    }
  }, [action, idToToggle, idToDelete]);

  return (
    <View>
      <Text testID="debtCount">{debts.length}</Text>
      {debts.map(d => (
        <View key={d.id}>
          <Text testID={`debtTitle-${d.id}`}>{d.title}</Text>
          <Text testID={`debtPaid-${d.id}`}>{d.isPaid.toString()}</Text>
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('adds a debt and persists to AsyncStorage', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent action="add" />
      </DebtProvider>
    );

    // Wait for the async actions to complete inside act if necessary
    await act(async () => {
      // Need a small timeout to let promises resolve
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getByTestId('debtCount').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts',
      expect.stringContaining('Test Debt')
    );
  });
});
