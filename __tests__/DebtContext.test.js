import React, { useContext, useEffect } from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import { Text, Button } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, toggleDebtStatus } = useContext(DebtContext);

  return (
    <>
      <Text testID="debts-count">{debts.length}</Text>
      <Button testID="add-btn" title="Add" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Individual' })} />
      {debts.length > 0 && (
        <>
          <Button testID="update-btn" title="Update" onPress={() => updateDebt(debts[0].id, { title: 'Updated Debt' })} />
          <Button testID="toggle-btn" title="Toggle" onPress={() => toggleDebtStatus(debts[0].id)} />
          <Button testID="delete-btn" title="Delete" onPress={() => deleteDebt(debts[0].id)} />
          <Text testID="debt-title">{debts[0].title}</Text>
          <Text testID="debt-status">{debts[0].isPaid ? 'Paid' : 'Pending'}</Text>
        </>
      )}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Old Debt' }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    });
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => expect(getByTestId('debts-count').props.children).toBe(0));

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
      expect(getByTestId('debt-title').props.children).toBe('Test Debt');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('updates a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Old Debt', amount: 50 }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => expect(getByTestId('debts-count').props.children).toBe(1));
    fireEvent.press(getByTestId('update-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-title').props.children).toBe('Updated Debt');
    });
  });

  it('toggles debt status', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Debt', isPaid: false }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => expect(getByTestId('debt-status').props.children).toBe('Pending'));
    fireEvent.press(getByTestId('toggle-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-status').props.children).toBe('Paid');
    });
  });

  it('deletes a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Debt' }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => expect(getByTestId('debts-count').props.children).toBe(1));
    fireEvent.press(getByTestId('delete-btn'));

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });
  });
});