import React, { useContext } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, togglePaid, deleteDebt } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Text testID="add-btn" onPress={() => addDebt({ description: 'Test', amount: '100', type: 'Individual' })}>Add</Text>
      {debts.map(d => (
        <View key={d.id}>
          <Text testID={`debt-paid-${d.id}`}>{d.isPaid.toString()}</Text>
          <Text testID={`toggle-btn-${d.id}`} onPress={() => togglePaid(d.id)}>Toggle</Text>
          <Text testID={`delete-btn-${d.id}`} onPress={() => deleteDebt(d.id)}>Delete</Text>
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', description: 'Test', amount: '10', isPaid: false }];
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(JSON.stringify(mockDebts)));

    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe("1");
    });
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => expect(getByTestId('debt-count').props.children).toBe("0"));

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe("1");
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
