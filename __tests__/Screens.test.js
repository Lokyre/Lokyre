import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import AddEditDebtScreen from '../src/screens/AddEditDebtScreen';
import DebtDetailScreen from '../src/screens/DebtDetailScreen';
import { DebtContext } from '../src/context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HomeScreen', () => {
    it('renders loading state initially', () => {
      const { getByText } = render(
        <DebtContext.Provider value={{ debts: [], loading: true }}>
          <PaperProvider>
            <HomeScreen navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );
      expect(getByText('Cargando deudas...')).toBeTruthy();
    });

    it('renders empty state when no debts', () => {
      const { getByText } = render(
        <DebtContext.Provider value={{ debts: [], loading: false }}>
          <PaperProvider>
            <HomeScreen navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );
      expect(getByText('No hay deudas registradas.')).toBeTruthy();
    });

    it('renders list of debts', () => {
      const mockDebts = [
        { id: '1', title: 'Debt 1', amount: 100, isPaid: false, type: 'Individual' }
      ];
      const { getByText, getByTestId } = render(
        <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
          <PaperProvider>
            <HomeScreen navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      expect(getByText('Debt 1')).toBeTruthy();
      expect(getByText('Total Pendiente: $100.00')).toBeTruthy();

      fireEvent.press(getByTestId('debt-card-1'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { id: '1' });
    });

    it('navigates to add screen on FAB press', () => {
      const { getByTestId } = render(
        <DebtContext.Provider value={{ debts: [], loading: false }}>
          <PaperProvider>
            <HomeScreen navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );
      fireEvent.press(getByTestId('add-debt-fab'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
    });
  });

  describe('AddEditDebtScreen', () => {
    it('allows adding a new debt', async () => {
      const mockAddDebt = jest.fn();
      const { getByTestId } = render(
        <DebtContext.Provider value={{ debts: [], addDebt: mockAddDebt, updateDebt: jest.fn() }}>
          <PaperProvider>
            <AddEditDebtScreen navigation={mockNavigation} route={{ params: {} }} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      fireEvent.changeText(getByTestId('input-title'), 'New Debt');
      fireEvent.changeText(getByTestId('input-amount'), '250');
      fireEvent.press(getByTestId('btn-save'));

      await waitFor(() => {
        expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
          title: 'New Debt',
          amount: 250,
          type: 'Individual'
        }));
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });

    it('allows editing an existing debt', async () => {
      const mockUpdateDebt = jest.fn();
      const mockDebts = [
        { id: '1', title: 'Old Debt', amount: 100, type: 'Tarjeta' }
      ];

      const { getByTestId } = render(
        <DebtContext.Provider value={{ debts: mockDebts, addDebt: jest.fn(), updateDebt: mockUpdateDebt }}>
          <PaperProvider>
            <AddEditDebtScreen navigation={mockNavigation} route={{ params: { id: '1' } }} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      fireEvent.changeText(getByTestId('input-title'), 'Updated Title');
      fireEvent.press(getByTestId('btn-save'));

      await waitFor(() => {
        expect(mockUpdateDebt).toHaveBeenCalledWith('1', expect.objectContaining({
          title: 'Updated Title',
        }));
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });
  });

  describe('DebtDetailScreen', () => {
    it('shows debt details and toggles status', async () => {
      const mockToggleStatus = jest.fn();
      const mockDebts = [
        { id: '1', title: 'Target Debt', amount: 500, type: 'Crédito', isPaid: false, createdAt: '2023-10-01' }
      ];

      const { getByText, getByTestId } = render(
        <DebtContext.Provider value={{ debts: mockDebts, toggleDebtStatus: mockToggleStatus, deleteDebt: jest.fn() }}>
          <PaperProvider>
            <DebtDetailScreen navigation={mockNavigation} route={{ params: { id: '1' } }} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      expect(getByText('Target Debt')).toBeTruthy();

      fireEvent.press(getByTestId('btn-toggle-status'));
      expect(mockToggleStatus).toHaveBeenCalledWith('1');
    });

    it('calls delete logic', async () => {
      jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
        // Find and trigger the destructive 'Eliminar' button callback
        const deleteButton = buttons.find(b => b.style === 'destructive');
        if (deleteButton && deleteButton.onPress) {
          deleteButton.onPress();
        }
      });

      const mockDeleteDebt = jest.fn();
      const mockDebts = [
        { id: '1', title: 'Target Debt', amount: 500, type: 'Crédito', isPaid: false, createdAt: '2023-10-01' }
      ];

      const { getByTestId } = render(
        <DebtContext.Provider value={{ debts: mockDebts, toggleDebtStatus: jest.fn(), deleteDebt: mockDeleteDebt }}>
          <PaperProvider>
            <DebtDetailScreen navigation={mockNavigation} route={{ params: { id: '1' } }} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      fireEvent.press(getByTestId('btn-delete'));

      await waitFor(() => {
        expect(mockDeleteDebt).toHaveBeenCalledWith('1');
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });
  });
});