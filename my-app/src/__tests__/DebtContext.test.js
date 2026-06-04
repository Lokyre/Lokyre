import React from 'react';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import { Text } from 'react-native';

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDebts));

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(DebtContext);
      return <Text>Test</Text>;
    };

    render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(contextValue.debts).toEqual(mockDebts);
    expect(contextValue.loading).toBe(false);
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(DebtContext);
      return <Text>Test</Text>;
    };

    render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await contextValue.addDebt({ title: 'New Debt', amount: 200 });
    });

    expect(contextValue.debts).toHaveLength(1);
    expect(contextValue.debts[0]).toMatchObject({ title: 'New Debt', amount: 200, isPaid: false });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', expect.any(String));
  });

  it('marks a debt as paid', async () => {
    const mockDebts = [{ id: '1', title: 'Test', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDebts));

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(DebtContext);
      return <Text>Test</Text>;
    };

    render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await contextValue.markAsPaid('1');
    });

    expect(contextValue.debts[0].isPaid).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('deletes a debt', async () => {
    const mockDebts = [{ id: '1', title: 'Test', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDebts));

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(DebtContext);
      return <Text>Test</Text>;
    };

    render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await contextValue.deleteDebt('1');
    });

    expect(contextValue.debts).toHaveLength(0);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
