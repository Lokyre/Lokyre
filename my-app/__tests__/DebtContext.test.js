import React, { useContext } from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import { Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, togglePaidStatus } = useContext(DebtContext);

  return (
    <>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ title: 'Test Debt', amount: '100', type: 'Tarjeta', dueDate: '', description: '' })}
      />
      {debts.map(d => (
        <React.Fragment key={d.id}>
          <Text testID={`debt-paid-${d.id}`}>{d.isPaid ? 'Yes' : 'No'}</Text>
          <Button
            testID={`toggle-btn-${d.id}`}
            title="Toggle"
            onPress={() => togglePaidStatus(d.id)}
          />
          <Button
            testID={`delete-btn-${d.id}`}
            title="Delete"
            onPress={() => deleteDebt(d.id)}
          />
        </React.Fragment>
      ))}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds, toggles, and deletes a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debt-count').props.children).toBe('0');

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => {
        expect(getByTestId('debt-count').props.children).toBe('1');
    });

    const toggleBtn = queryByTestId(/^toggle-btn-/);
    const deleteBtn = queryByTestId(/^delete-btn-/);
    const id = toggleBtn.props.testID.replace('toggle-btn-', '');

    expect(getByTestId(`debt-paid-${id}`).props.children).toBe('No');

    await act(async () => {
      fireEvent.press(toggleBtn);
    });

    await waitFor(() => {
        expect(getByTestId(`debt-paid-${id}`).props.children).toBe('Yes');
    });

    await act(async () => {
      fireEvent.press(deleteBtn);
    });

    await waitFor(() => {
        expect(getByTestId('debt-count').props.children).toBe('0');
    });
  });
});
