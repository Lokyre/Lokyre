import React from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, useDebts } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, updateDebt, isLoading } = useDebts();

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <>
      <Text testID="debt-count">{debts.length}</Text>
      {debts.map(d => (
        <Text key={d.id} testID={`debt-title-${d.id}`}>{d.title}</Text>
      ))}
      <Text testID="add-btn" onPress={() => addDebt({ id: '1', title: 'Test Debt', amount: 100, isPaid: false })} />
      <Text testID="update-btn" onPress={() => updateDebt('1', { isPaid: true })} />
      <Text testID="delete-btn" onPress={() => deleteDebt('1')} />
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts on mount', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '2', title: 'Stored Debt', amount: 50, isPaid: false }]));

    const component = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(component.getByTestId('debt-count').props.children).toBe(1);
    expect(component.getByTestId('debt-title-2')).toBeTruthy();
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const component = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      component.getByTestId('add-btn').props.onPress();
    });

    expect(component.getByTestId('debt-count').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', expect.stringContaining('Test Debt'));
  });

  it('updates a debt', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1', title: 'Test Debt', amount: 100, isPaid: false }]));

    const component = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      component.getByTestId('update-btn').props.onPress();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', expect.stringContaining('"isPaid":true'));
  });

  it('deletes a debt', async () => {
     AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1', title: 'Test Debt', amount: 100, isPaid: false }]));

     const component = render(
       <DebtProvider>
         <TestComponent />
       </DebtProvider>
     );

     await act(async () => {
       await Promise.resolve();
     });

     await act(async () => {
       component.getByTestId('delete-btn').props.onPress();
     });

     expect(component.getByTestId('debt-count').props.children).toBe(0);
     expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', '[]');
  });
});
