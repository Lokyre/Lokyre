import React, { useContext } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtContext, DebtProvider } from '../src/context/DebtContext';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, markAsPaid } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Button
        title="Add"
        testID="add-btn"
        onPress={() => addDebt({ description: 'Test', amount: 100, category: 'Tarjetas' })}
      />
      {debts.length > 0 && (
        <>
          <Button
            title="Update"
            testID="update-btn"
            onPress={() => updateDebt({ ...debts[0], description: 'Updated' })}
          />
          <Button
            title="Delete"
            testID="delete-btn"
            onPress={() => deleteDebt(debts[0].id)}
          />
          <Button
            title="Mark Paid"
            testID="paid-btn"
            onPress={() => markAsPaid(debts[0].id)}
          />
          <Text testID="first-debt-desc">{debts[0].description}</Text>
          <Text testID="first-debt-paid">{debts[0].paid ? 'yes' : 'no'}</Text>
        </>
      )}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('0');
    });
  });

  it('can add a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('0');
    });

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
      expect(getByTestId('first-debt-desc').props.children).toBe('Test');
    });
  });

  it('can update a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
      { id: '1', description: 'Old', amount: 50, category: 'Personas', paid: false }
    ]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
    });

    fireEvent.press(getByTestId('update-btn'));

    await waitFor(() => {
      expect(getByTestId('first-debt-desc').props.children).toBe('Updated');
    });
  });

  it('can delete a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
      { id: '1', description: 'To delete', amount: 50, category: 'Personas', paid: false }
    ]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
    });

    fireEvent.press(getByTestId('delete-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('0');
    });
  });

  it('can mark debt as paid', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
      { id: '1', description: 'Pay me', amount: 50, category: 'Personas', paid: false }
    ]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
    });

    fireEvent.press(getByTestId('paid-btn'));

    await waitFor(() => {
      expect(getByTestId('first-debt-paid').props.children).toBe('yes');
    });
  });
});
