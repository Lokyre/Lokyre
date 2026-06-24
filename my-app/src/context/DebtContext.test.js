import React, { useContext } from 'react';
import { View, Button, Text } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, togglePaid } = useContext(DebtContext);

  return (
    <View>
      <Button
        title="Add Debt"
        testID="add-btn"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta' })}
      />
      {debts.map(debt => (
        <View key={debt.id} testID={`debt-${debt.id}`}>
          <Text testID={`debt-title-${debt.id}`}>{debt.title}</Text>
          <Text testID={`debt-paid-${debt.id}`}>{debt.isPaid ? 'Pagado' : 'Pendiente'}</Text>
          <Button
            title="Toggle Paid"
            testID={`toggle-btn-${debt.id}`}
            onPress={() => togglePaid(debt.id)}
          />
          <Button
            title="Delete Debt"
            testID={`delete-btn-${debt.id}`}
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

  it('initializes with empty debts if storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(queryByText('Test Debt')).toBeNull();
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const addBtn = getByTestId('add-btn');
    await act(async () => {
      fireEvent.press(addBtn);
    });

    const titleText = await findByText('Test Debt');
    expect(titleText).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('toggles a debt', async () => {
    const mockId = '123';
    const mockDebt = [{ id: mockId, title: 'Test Debt', amount: 100, type: 'Tarjeta', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebt));

    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const pendingText = await findByText('Pendiente');
    expect(pendingText).toBeTruthy();

    const toggleBtn = getByTestId(`toggle-btn-${mockId}`);
    await act(async () => {
      fireEvent.press(toggleBtn);
    });

    const pagadoText = await findByText('Pagado');
    expect(pagadoText).toBeTruthy();
  });

  it('deletes a debt', async () => {
    const mockId = '123';
    const mockDebt = [{ id: mockId, title: 'Delete Me', amount: 100, type: 'Tarjeta', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebt));

    const { getByTestId, queryByText, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const titleText = await findByText('Delete Me');
    expect(titleText).toBeTruthy();

    const deleteBtn = getByTestId(`delete-btn-${mockId}`);
    await act(async () => {
      fireEvent.press(deleteBtn);
    });

    expect(queryByText('Delete Me')).toBeNull();
  });
});
