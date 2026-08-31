import React, { useContext } from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper component to access context in tests
const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, isLoaded } = useContext(DebtContext);

  return (
    <View>
      <Text testID="isLoaded">{isLoaded.toString()}</Text>
      <Text testID="debtsCount">{debts.length.toString()}</Text>
      {debts.map(d => (
        <Text key={d.id} testID={`debt-title-${d.id}`}>{d.title}</Text>
      ))}
      <Button
        testID="addBtn"
        title="Add"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjetas' })}
      />
      {debts.length > 0 && (
        <>
          <Button
            testID="updateBtn"
            title="Update"
            onPress={() => updateDebt(debts[0].id, { title: 'Updated Debt' })}
          />
          <Button
            testID="deleteBtn"
            title="Delete"
            onPress={() => deleteDebt(debts[0].id)}
          />
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
    const mockDebts = [{ id: '1', title: 'Saved Debt', amount: 50, type: 'Créditos' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isLoaded').props.children).toBe('true');
    }, { timeout: 10000 });

    expect(getByTestId('debtsCount').props.children).toBe('1');
    expect(await findByText('Saved Debt')).toBeTruthy();
  });

  it('adds a new debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); // No initial debts

    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isLoaded').props.children).toBe('true');
    }, { timeout: 10000 });

    act(() => {
      fireEvent.press(getByTestId("addBtn"));
    });

    await waitFor(() => {
      expect(getByTestId('debtsCount').props.children).toBe('1');
    });

    expect(await findByText('Test Debt')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts_list',
      expect.stringContaining('Test Debt')
    );
  });

  it('updates an existing debt', async () => {
    const mockDebts = [{ id: '1', title: 'Old Title', amount: 50, type: 'Créditos' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isLoaded').props.children).toBe('true');
    }, { timeout: 10000 });

    act(() => {
      fireEvent.press(getByTestId("updateBtn"));
    });

    await waitFor(() => {
      expect(getByTestId('debt-title-1').props.children).toBe('Updated Debt');
    });
  });

  it('deletes an existing debt', async () => {
    const mockDebts = [{ id: '1', title: 'To Delete', amount: 50, type: 'Créditos' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isLoaded').props.children).toBe('true');
    }, { timeout: 10000 });

    expect(getByTestId('debtsCount').props.children).toBe('1');

    act(() => {
      fireEvent.press(getByTestId("deleteBtn"));
    });

    await waitFor(() => {
      expect(getByTestId('debtsCount').props.children).toBe('0');
    });
  });
});