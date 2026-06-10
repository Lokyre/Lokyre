import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from './AddDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider, TextInput } from 'react-native-paper';

jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

describe('AddDebtScreen', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockAddDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows user to input debt data and save', async () => {
    const { UNSAFE_getAllByType, getByText } = render(
      <PaperProvider>
        <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
          <AddDebtScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    const inputs = UNSAFE_getAllByType(TextInput);

    // Asumimos el orden: Título, Monto, Fecha, Descripción
    fireEvent.changeText(inputs[0], 'Nueva Deuda Test');
    fireEvent.changeText(inputs[1], '500');
    fireEvent.changeText(inputs[2], '2024-01-01');
    fireEvent.changeText(inputs[3], 'Descripción de prueba');

    fireEvent.press(getByText('Guardar Deuda'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      id: 'test-uuid',
      title: 'Nueva Deuda Test',
      amount: '500',
      type: 'Tarjeta',
      dueDate: '2024-01-01',
      description: 'Descripción de prueba',
      isPaid: false
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
