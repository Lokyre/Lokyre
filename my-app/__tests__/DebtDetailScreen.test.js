import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';
import DebtDetailScreen from '../src/screens/DebtDetailScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = { goBack: jest.fn() };
const mockTogglePaidStatus = jest.fn();
const mockDeleteDebt = jest.fn();

const renderWithContext = (debt) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={{ togglePaidStatus: mockTogglePaidStatus, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen route={{ params: { debt } }} navigation={mockNavigation} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('DebtDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      // Simulate pressing the "Eliminar" button
      buttons[1].onPress();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockDebt = {
    id: '123',
    title: 'Test Debt',
    amount: 150,
    type: 'Tarjeta',
    isPaid: false,
    dueDate: '10/10/2023',
    description: 'Test description'
  };

  it('renders debt details correctly', () => {
    const { getByText } = renderWithContext(mockDebt);

    // We cannot easily get Card.Title since the mock in jest.setup.js replaces it with the real one which might have complex structure
    // but we can query standard Text elements inside Card.Content.
    expect(getByText('$150.00')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
    expect(getByText('10/10/2023')).toBeTruthy();
    expect(getByText('Test description')).toBeTruthy();
  });

  it('toggles paid status', async () => {
    const { getByText } = renderWithContext(mockDebt);
    const toggleButton = getByText('Marcar como Pagado');

    await act(async () => {
      fireEvent.press(toggleButton);
    });

    expect(mockTogglePaidStatus).toHaveBeenCalledWith('123');
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deletes debt', async () => {
    const { getByText } = renderWithContext(mockDebt);
    const deleteButton = getByText('Eliminar Deuda');

    await act(async () => {
      fireEvent.press(deleteButton);
    });

    expect(Alert.alert).toHaveBeenCalled();
    expect(mockDeleteDebt).toHaveBeenCalledWith('123');
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
