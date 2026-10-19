import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext, DEBT_TYPES } from '../src/context/DebtContext';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const TestComponent = () => {
  const { debts, addDebt } = React.useContext(DebtContext);
  return (
    <>
      <Text testID="debtCount">{debts.length}</Text>
      <Text testID="addDebtButton" onPress={() => addDebt({ id: '1', description: 'Test', amount: 100, type: DEBT_TYPES.TARJETAS })} />
    </>
  );
};

describe('DebtContext', () => {
  it('loads empty debts initially', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debtCount').props.children).toBe(0);
    });
  });
});
