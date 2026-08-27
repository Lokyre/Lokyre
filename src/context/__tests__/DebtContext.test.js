import React, { useContext } from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, View } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, markAsPaid, deleteDebt } = useContext(DebtContext);
  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      <Button testID="add-btn" title="Add" onPress={() => addDebt({ title: 'Test', amount: 100, type: 'persona' })} />
      {debts.map(d => (
        <View key={d.id}>
          <Text testID={`debt-${d.id}`}>{d.title} - {d.isPaid ? 'Paid' : 'Pending'}</Text>
          <Button testID={`pay-btn-${d.id}`} title="Pay" onPress={() => markAsPaid(d.id)} />
          <Button testID={`del-btn-${d.id}`} title="Del" onPress={() => deleteDebt(d.id)} />
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
  });

  it('loads debts from storage', async () => {
    const { getByTestId } = render(<DebtProvider><TestComponent /></DebtProvider>);
    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });
  });

  it('adds a debt', async () => {
    const { getByTestId } = render(<DebtProvider><TestComponent /></DebtProvider>);
    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
