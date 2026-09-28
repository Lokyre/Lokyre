import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import { Text, View, Button } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, toggleDebtStatus, isLoaded } = React.useContext(DebtContext);

  if (!isLoaded) return <Text>Loading...</Text>;

  return (
    <View>
      <Text testID="debtCount">{debts.length}</Text>
      <Button title="Add" testID="addButton" onPress={() => addDebt('Test', '100', 'Individuales')} />
      {debts.map(debt => (
        <View key={debt.id} testID="debtItem">
          <Text testID={`debtStatus-${debt.id}`}>{debt.isPaid ? 'Paid' : 'Unpaid'}</Text>
          <Button title="Toggle" testID={`toggle-${debt.id}`} onPress={() => toggleDebtStatus(debt.id)} />
          <Button title="Delete" testID={`delete-${debt.id}`} onPress={() => deleteDebt(debt.id)} />
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  it('allows adding, toggling and deleting debts', async () => {
    const { getByTestId, findByText, findAllByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await findByText('0');
    fireEvent.press(getByTestId('addButton'));

    expect(getByTestId('debtCount').props.children).toBe(1);
    const toggleButton = (await findAllByTestId(/toggle-/))[0];
    const deleteButton = (await findAllByTestId(/delete-/))[0];

    // Toggle
    fireEvent.press(toggleButton);
    const statusText = (await findAllByTestId(/debtStatus-/))[0];
    expect(statusText.props.children).toBe('Paid');

    // Delete
    fireEvent.press(deleteButton);
    expect(getByTestId('debtCount').props.children).toBe(0);
  });
});
