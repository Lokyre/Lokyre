import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, togglePaidStatus, loading } = React.useContext(DebtContext);

  if (loading) return <Text>Loading...</Text>;

  return (
    <>
      <Button
        title="Add Debt"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Individual' })}
        testID="add-btn"
      />
      {debts.map(debt => (
        <React.Fragment key={debt.id}>
          <Text testID={`debt-title-${debt.id}`}>{debt.title}</Text>
          <Text testID={`debt-status-${debt.id}`}>{debt.isPaid ? 'Paid' : 'Unpaid'}</Text>
          <Button
            title="Toggle Paid"
            onPress={() => togglePaidStatus(debt.id)}
            testID={`toggle-btn-${debt.id}`}
          />
          <Button
            title="Delete Debt"
            onPress={() => deleteDebt(debt.id)}
            testID={`del-btn-${debt.id}`}
          />
        </React.Fragment>
      ))}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Existing Debt', amount: 50, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Initial state might show Loading, wait for effect to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts_list');
    expect(getByText('Existing Debt')).toBeTruthy();
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const { fireEvent } = require('@testing-library/react-native');
    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByText('Test Debt')).toBeTruthy();
    expect(getByText('Unpaid')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
