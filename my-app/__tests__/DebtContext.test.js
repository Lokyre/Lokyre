import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../src/context/DebtContext';
import { Text, Button } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useDebts();

  return (
    <>
      <Text testID="debts-length">{debts.length.toString()}</Text>
      <Button
        testID="btn-add"
        title="Add"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', dueDate: '10/10/2023', description: '' })}
      />
      {debts.map(d => (
        <Button key={d.id} testID={`btn-delete-${d.id}`} title="Delete" onPress={() => deleteDebt(d.id)} />
      ))}
    </>
  );
};

describe('DebtContext', () => {
  it('adds and deletes a debt', async () => {
    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve(); // wait for init
    });

    expect(getByTestId('debts-length').props.children).toBe('0');

    await act(async () => {
      fireEvent.press(getByTestId('btn-add'));
    });

    expect(getByTestId('debts-length').props.children).toBe('1');

    // Find the dynamically created delete button and press it
    const deleteBtnRegex = /^btn-delete-/;
    const deleteBtn = getByTestId(deleteBtnRegex);

    await act(async () => {
      fireEvent.press(deleteBtn);
    });

    expect(getByTestId('debts-length').props.children).toBe('0');
  });
});
