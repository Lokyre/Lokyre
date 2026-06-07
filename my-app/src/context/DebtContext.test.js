import React, { useContext } from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import { Text, Button, View } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useContext(DebtContext);
  return (
    <View>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Button
        title="Add Debt"
        testID="add-btn"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', dueDate: '2023-12-31' })}
      />
      {debts.length > 0 && (
        <Button
          title="Delete Debt"
          testID="del-btn"
          onPress={() => deleteDebt(debts[0].id)}
        />
      )}
    </View>
  );
};

describe('DebtContext', () => {
  it('adds and deletes debts correctly', async () => {
    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('debt-count').props.children).toBe('0');

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByTestId('debt-count').props.children).toBe('1');

    await act(async () => {
      fireEvent.press(getByTestId('del-btn'));
    });

    expect(getByTestId('debt-count').props.children).toBe('0');
  });
});
