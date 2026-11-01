import React, { useContext } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import { View, Button, Text } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, toggleDebtStatus } = useContext(DebtContext);

  return (
    <View>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt('Test Debt', '100', 'Tarjetas')}
      />
      {debts.map((d) => (
        <View key={d.id} testID={`debt-${d.id}`}>
          <Text>{d.title}</Text>
          <Text>{d.amount}</Text>
          <Text>{d.type}</Text>
          <Text testID={`status-${d.id}`}>{d.isPaid ? 'Paid' : 'Pending'}</Text>
          <Button
            testID={`toggle-btn-${d.id}`}
            title="Toggle"
            onPress={() => toggleDebtStatus(d.id)}
          />
          <Button
            testID={`delete-btn-${d.id}`}
            title="Delete"
            onPress={() => deleteDebt(d.id)}
          />
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  it('should add, toggle, and delete a debt', async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Add debt
    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-mocked-uuid')).toBeTruthy();
      expect(getByText('Test Debt')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
      expect(getByText('Tarjetas')).toBeTruthy();
      expect(getByTestId('status-mocked-uuid')).toHaveTextContent('Pending');
    });

    // Toggle debt status
    fireEvent.press(getByTestId('toggle-btn-mocked-uuid'));

    await waitFor(() => {
      expect(getByTestId('status-mocked-uuid')).toHaveTextContent('Paid');
    });

    // Delete debt
    fireEvent.press(getByTestId('delete-btn-mocked-uuid'));

    await waitFor(() => {
      expect(queryByTestId('debt-mocked-uuid')).toBeNull();
    });
  });
});
