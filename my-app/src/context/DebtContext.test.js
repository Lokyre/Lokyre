import React, { useContext, useEffect } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from './DebtContext';
import { Text, View } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = ({ testAction }) => {
    const context = useContext(DebtContext);
    useEffect(() => {
      if (testAction) {
        testAction(context);
      }
    }, []);

    return (
      <View>
        <Text testID="debt-count">{context.debts.length}</Text>
      </View>
    );
  };

  it('loads debts on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', totalAmount: 100 }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    });
  });

  it('adds a debt and saves it', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const testAction = async (context) => {
      await context.addDebt({ title: 'New Debt', totalAmount: 200, type: 'Individuales' });
    };

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent testAction={testAction} />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@debts',
        expect.stringContaining('"title":"New Debt"')
      );
      expect(getByTestId('debt-count').props.children).toBe(1);
    });
  });
});
