import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DebtDetailScreen from './DebtDetailScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
    useRoute: () => ({
      params: { debtId: '1' }
    }),
  };
});

describe('DebtDetailScreen', () => {
  const mockDeleteDebt = jest.fn();
  const mockTogglePaidStatus = jest.fn();

  const mockContextValue = {
    debts: [
      { id: '1', title: 'Test Debt', amount: 100, type: 'Crédito', isPaid: false, description: 'Test Desc', dueDate: '12/12/2025' },
    ],
    deleteDebt: mockDeleteDebt,
    togglePaidStatus: mockTogglePaidStatus,
  };

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <NavigationContainer>
        <DebtContext.Provider value={contextValue}>
          <DebtDetailScreen />
        </DebtContext.Provider>
      </NavigationContainer>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      // Simulate pressing the 'Eliminar' button
      buttons.find(b => b.text === 'Eliminar').onPress();
    });
  });

  it('renders debt details correctly', () => {
    const { getByText } = renderWithContext();

    expect(getByText('Test Debt')).toBeTruthy();
    expect(getByText('Tipo: Crédito')).toBeTruthy();
    expect(getByText('$100')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
    expect(getByText('Test Desc')).toBeTruthy();
    expect(getByText('12/12/2025')).toBeTruthy();
  });

  it('toggles paid status', async () => {
    const { getByTestId } = renderWithContext();

    await act(async () => {
      fireEvent.press(getByTestId('btn-toggle-paid'));
    });

    expect(mockTogglePaidStatus).toHaveBeenCalledWith('1');
  });

  it('deletes debt after confirmation', async () => {
    const { getByTestId } = renderWithContext();

    await act(async () => {
      fireEvent.press(getByTestId('btn-delete'));
    });

    expect(Alert.alert).toHaveBeenCalled();
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders not found when debt is missing', () => {
      const { getByText } = renderWithContext({ ...mockContextValue, debts: [] });
      expect(getByText('Deuda no encontrada.')).toBeTruthy();
  });
});
