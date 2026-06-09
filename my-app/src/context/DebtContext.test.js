import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, toggleDebtStatus, loading } = useContext(DebtContext);

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      <Button
        title="Agregar Deuda"
        testID="add-btn"
        onPress={() => addDebt({ title: 'Nueva Deuda', amount: 100, type: 'Crédito', dueDate: '2024-12-01' })}
      />
      {debts.map((debt) => (
        <View key={debt.id} testID={`debt-${debt.id}`}>
          <Text testID={`debt-title-${debt.id}`}>{debt.title}</Text>
          <Text testID={`debt-status-${debt.id}`}>{debt.isPaid ? 'Pagada' : 'Pendiente'}</Text>
          <Button title="Toggle" testID={`toggle-btn-${debt.id}`} onPress={() => toggleDebtStatus(debt.id)} />
          <Button title="Eliminar" testID={`delete-btn-${debt.id}`} onPress={() => deleteDebt(debt.id)} />
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  it('allows adding, toggling, and deleting a debt', async () => {
    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });

    // Verify initial state
    expect(getByTestId('debt-count').children[0]).toBe('0');

    // Add a debt
    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    // Verify debt added
    expect(getByTestId('debt-count').children[0]).toBe('1');

    // Find the dynamic ID of the added debt (uuid)
    // Since we don't know the exact ID, we can check that a title element containing 'Nueva Deuda' exists
    const titleElement = getByTestId(/^debt-title-/);
    const id = titleElement.props.testID.replace('debt-title-', '');

    // Verify initial status
    expect(getByTestId(`debt-status-${id}`).children[0]).toBe('Pendiente');

    // Toggle status
    await act(async () => {
      fireEvent.press(getByTestId(`toggle-btn-${id}`));
    });

    expect(getByTestId(`debt-status-${id}`).children[0]).toBe('Pagada');

    // Delete debt
    await act(async () => {
      fireEvent.press(getByTestId(`delete-btn-${id}`));
    });

    expect(getByTestId('debt-count').children[0]).toBe('0');
    expect(queryByTestId(`debt-${id}`)).toBeNull();
  });
});
