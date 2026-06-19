import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import { Text, Button } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = React.useContext(DebtContext);

  return (
    <>
      <Text testID="debt-count">{debts.length}</Text>
      <Button
        title="Add Debt"
        testID="btn-add"
        onPress={() => addDebt({ title: 'Test', amount: '100', type: 'Tarjeta', dueDate: '', description: '' })}
      />
      {debts.map(debt => (
        <Button
          key={debt.id}
          title={`Delete ${debt.title}`}
          testID={`btn-delete-${debt.id}`}
          onPress={() => deleteDebt(debt.id)}
        />
      ))}
    </>
  );
};

describe('DebtContext', () => {
  it('adds a debt correctly', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Context loads async from AsyncStorage
    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(0);
    });

    fireEvent.press(getByTestId('btn-add'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    });
  });
});
