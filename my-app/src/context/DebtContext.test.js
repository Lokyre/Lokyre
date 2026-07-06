import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from './DebtContext';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, toggleDebtPaid } = useContext(DebtContext);
  return (
    <View>
      {debts.map(d => (
        <View key={d.id} testID={`debt-${d.id}`}>
          <Text>{d.title}</Text>
          <Text>{d.isPaid ? 'Paid' : 'Unpaid'}</Text>
        </View>
      ))}
      <Button testID="add-btn" title="Add" onPress={() => addDebt({ id: '1', title: 'Test Debt', isPaid: false })} />
      <Button testID="del-btn" title="Delete" onPress={() => deleteDebt('1')} />
      <Button testID="toggle-btn" title="Toggle" onPress={() => toggleDebtPaid('1')} />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '99', title: 'Saved Debt', isPaid: true }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(getByText('Saved Debt')).toBeTruthy();
  });

  it('adds a debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByText('Test Debt')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', JSON.stringify([{ id: '1', title: 'Test Debt', isPaid: false }]));
  });

  it('toggles debt status and saves to AsyncStorage', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, getByText, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Unpaid')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('toggle-btn'));
    });

    expect(getByText('Paid')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('deletes a debt and saves to AsyncStorage', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, getByText, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Test Debt')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('del-btn'));
    });

    expect(queryByText('Test Debt')).toBeNull();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', JSON.stringify([]));
  });
});
