import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from '../DebtContext';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, isLoaded } = useContext(DebtContext);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Button
        title="Add Debt"
        testID="add-debt-btn"
        onPress={() => addDebt('Test Debt', '150', 'Personas')}
      />
      {debts.map(debt => (
        <View key={debt.id}>
          <Text testID={`debt-name-${debt.id}`}>{debt.name}</Text>
          <Button
            title="Delete Debt"
            testID={`delete-debt-btn-${debt.id}`}
            onPress={() => deleteDebt(debt.id)}
          />
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially if storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    expect(getByText('Loading...')).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('0');
    });
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', name: 'Old Debt', amount: 100, type: 'Créditos', date: new Date().toISOString() }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
    });

    expect(getByText('Old Debt')).toBeTruthy();
  });

  it('adds a new debt and persists to storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('0');
    });

    fireEvent.press(getByTestId('add-debt-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
    });

    expect(getByText('Test Debt')).toBeTruthy();

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@debts',
        expect.stringContaining('Test Debt')
      );
    });
  });

  it('deletes a debt', async () => {
    const mockDebts = [{ id: 'delete-me', name: 'Bad Debt', amount: 50, type: 'Individuales', date: new Date().toISOString() }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
    });

    fireEvent.press(getByTestId('delete-debt-btn-delete-me'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('0');
    });

    expect(queryByText('Bad Debt')).toBeNull();
  });
});
