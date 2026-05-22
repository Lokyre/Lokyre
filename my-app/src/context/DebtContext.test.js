import React, { useContext } from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import { Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

const TestComponent = () => {
  const { debts, addDebt, removeDebt, togglePaid } = useContext(DebtContext);

  return (
    <>
      <Text testID="debt-count">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt('Test Debt', '100', 'individual')}
      />
      {debts.length > 0 && (
        <>
          <Text testID="debt-title">{debts[0].title}</Text>
          <Text testID="debt-paid">{debts[0].isPaid ? 'Yes' : 'No'}</Text>
          <Button
            testID="toggle-btn"
            title="Toggle"
            onPress={() => togglePaid(debts[0].id)}
          />
          <Button
            testID="remove-btn"
            title="Remove"
            onPress={() => removeDebt(debts[0].id)}
          />
        </>
      )}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('provides empty debts initially', () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    expect(getByTestId('debt-count').props.children).toBe(0);
  });

  it('allows adding a debt', () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(getByTestId('debt-title').props.children).toBe('Test Debt');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('allows toggling paid status', () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByTestId('debt-paid').props.children).toBe('No');

    act(() => {
      fireEvent.press(getByTestId('toggle-btn'));
    });

    expect(getByTestId('debt-paid').props.children).toBe('Yes');
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2); // once for add, once for toggle
  });

  it('allows removing a debt', () => {
    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByTestId('debt-count').props.children).toBe(1);

    act(() => {
      fireEvent.press(getByTestId('remove-btn'));
    });

    expect(getByTestId('debt-count').props.children).toBe(0);
    expect(queryByTestId('debt-title')).toBeNull();
  });
});
