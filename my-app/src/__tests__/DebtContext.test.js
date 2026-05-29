import React, { useContext } from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import { Text } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useContext(DebtContext);

  return (
    <>
      <Text testID="debtsCount">{debts.length}</Text>
      <Text testID="addDebt" onPress={() => addDebt({ name: 'Test Debt', amount: 100, type: 'tarjeta' })}>Add</Text>
      <Text testID="deleteDebt" onPress={() => debts.length > 0 && deleteDebt(debts[0].id)}>Delete</Text>
    </>
  );
};

describe('DebtContext', () => {
  it('adds and removes a debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    expect(getByTestId('debtsCount').props.children).toBe(0);

    await act(async () => {
      getByTestId('addDebt').props.onPress();
    });

    expect(getByTestId('debtsCount').props.children).toBe(1);

    await act(async () => {
      getByTestId('deleteDebt').props.onPress();
    });

    expect(getByTestId('debtsCount').props.children).toBe(0);
  });
});
