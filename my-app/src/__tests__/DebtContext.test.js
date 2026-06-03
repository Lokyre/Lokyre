import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import { DebtContext, DebtProvider } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper component to consume context
const TestComponent = () => {
  const { debts, addDebt, editDebt, deleteDebt, toggleDebtPaidStatus } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debtCount">{debts.length}</Text>
      <Button
        testID="addBtn"
        title="Add"
        onPress={() =>
          addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', dueDate: '01/01/2025' })
        }
      />
      {debts.length > 0 && (
        <>
          <Text testID="firstDebtTitle">{debts[0].title}</Text>
          <Text testID="firstDebtPaid">{debts[0].isPaid.toString()}</Text>
          <Button
            testID="editBtn"
            title="Edit"
            onPress={() => editDebt(debts[0].id, { title: 'Updated Debt' })}
          />
          <Button
            testID="toggleBtn"
            title="Toggle"
            onPress={() => toggleDebtPaidStatus(debts[0].id)}
          />
          <Button testID="deleteBtn" title="Delete" onPress={() => deleteDebt(debts[0].id)} />
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
    const mockData = JSON.stringify([
      { id: '1', title: 'Saved Debt', amount: 50, type: 'Crédito', dueDate: '12/12/2024', isPaid: false },
    ]);
    AsyncStorage.getItem.mockResolvedValueOnce(mockData);

    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for context to initialize
    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debtCount').props.children).toBe(1);
    expect(await findByText('Saved Debt')).toBeTruthy();
  });

  it('adds a debt and saves to AsyncStorage', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debtCount').props.children).toBe(0);

    fireEvent.press(getByTestId('addBtn'));

    expect(getByTestId('debtCount').props.children).toBe(1);
    expect(getByTestId('firstDebtTitle').props.children).toBe('Test Debt');

    // Check if setItem was called with the new list
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts_list',
      expect.stringContaining('Test Debt')
    );
  });

  it('edits a debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByTestId('addBtn'));
    fireEvent.press(getByTestId('editBtn'));

    expect(getByTestId('firstDebtTitle').props.children).toBe('Updated Debt');
  });

  it('toggles debt paid status', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByTestId('addBtn'));
    expect(getByTestId('firstDebtPaid').props.children).toBe('false');

    fireEvent.press(getByTestId('toggleBtn'));
    expect(getByTestId('firstDebtPaid').props.children).toBe('true');
  });

  it('deletes a debt', async () => {
    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByTestId('addBtn'));
    expect(getByTestId('debtCount').props.children).toBe(1);

    fireEvent.press(getByTestId('deleteBtn'));
    expect(getByTestId('debtCount').props.children).toBe(0);
    expect(queryByTestId('firstDebtTitle')).toBeNull();
  });
});
