import React, { useContext } from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, toggleDebtStatus, isReady } = useContext(DebtContext);

  if (!isReady) return <Text>Loading</Text>;

  return (
    <View>
      {debts.map(d => (
        <View key={d.id} testID={`debt-item-${d.id}`}>
          <Text>{d.concept}</Text>
          <Text>{d.isPaid ? 'Paid' : 'Unpaid'}</Text>
          <TouchableOpacity testID={`delete-${d.id}`} onPress={() => deleteDebt(d.id)} />
          <TouchableOpacity testID={`toggle-${d.id}`} onPress={() => toggleDebtStatus(d.id)} />
        </View>
      ))}
      <TouchableOpacity
        testID="add-debt-btn"
        onPress={() => addDebt({ id: '123', concept: 'Test Debt', amount: 100, type: 'Tarjetas', isPaid: false })}
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    const { getByText, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(queryByTestId('debt-item-123')).toBeNull();
  });

  it('adds a debt and updates state', async () => {
    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    fireEvent.press(getByTestId('add-debt-btn'));

    await act(async () => { await Promise.resolve(); });

    expect(getByText('Test Debt')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', JSON.stringify([{
      id: '123', concept: 'Test Debt', amount: 100, type: 'Tarjetas', isPaid: false
    }]));
  });

  it('toggles a debt status', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{
      id: '123', concept: 'Test Debt', amount: 100, type: 'Tarjetas', isPaid: false
    }]));

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByText('Unpaid')).toBeTruthy();

    fireEvent.press(getByTestId('toggle-123'));

    await act(async () => { await Promise.resolve(); });

    expect(getByText('Paid')).toBeTruthy();
  });

  it('deletes a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{
      id: '123', concept: 'Test Debt', amount: 100, type: 'Tarjetas', isPaid: false
    }]));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(queryByText('Test Debt')).toBeTruthy();

    fireEvent.press(getByTestId('delete-123'));

    await act(async () => { await Promise.resolve(); });

    expect(queryByText('Test Debt')).toBeNull();
  });
});
