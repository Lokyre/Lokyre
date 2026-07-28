import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import AddDebtScreen from '../AddDebtScreen';
import DebtDetailScreen from '../DebtDetailScreen';
import { DebtContext } from '../../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

describe('Screens Integration', () => {
  const mockDebts = [
    { id: '1', title: 'Prestamo', amount: 500, type: 'Crédito', isPaid: false, description: 'Bank' },
    { id: '2', title: 'Tarjeta', amount: 200, type: 'Tarjeta', isPaid: true }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HomeScreen', () => {
    it('renders loading state initially if loading is true', () => {
      const { getByTestId } = render(
        <DebtContext.Provider value={{ debts: [], loading: true }}>
          <PaperProvider>
            <HomeScreen navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      expect(getByTestId('activity-indicator')).toBeTruthy();
    });

    it('renders list of debts and calculates total correctly', async () => {
      const { getByTestId, getByText } = render(
        <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
          <PaperProvider>
            <HomeScreen navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      // Check total pending (only sum unpaid debts)
      const totalText = getByTestId('total-pending');
      expect(totalText.props.children).toEqual(expect.arrayContaining(['500.00']));

      // Check debts render
      expect(getByText('Prestamo')).toBeTruthy();
      expect(getByText('Tarjeta')).toBeTruthy();

      // Check navigation to details
      fireEvent.press(getByTestId('debt-item-1'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { debt: mockDebts[0] });

      // Check navigation to AddDebt
      fireEvent.press(getByTestId('fab-add-debt'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
    });
  });

  describe('AddDebtScreen', () => {
    it('calls addDebt and goes back on valid submit', async () => {
      const addDebtMock = jest.fn().mockResolvedValue();
      const { getByTestId } = render(
        <DebtContext.Provider value={{ addDebt: addDebtMock }}>
          <PaperProvider>
            <AddDebtScreen navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      fireEvent.changeText(getByTestId('input-title'), 'New Debt');
      fireEvent.changeText(getByTestId('input-amount'), '100');
      // For radio button, we can either mock it better or just test with default. We test with default 'Individual'

      await act(async () => {
        fireEvent.press(getByTestId('btn-save'));
      });

      expect(addDebtMock).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Debt',
        amount: 100,
        type: 'Individual' // the default
      }));
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('DebtDetailScreen', () => {
    it('renders debt details correctly', () => {
      const { getByTestId } = render(
        <DebtContext.Provider value={{}}>
          <PaperProvider>
            <DebtDetailScreen route={{ params: { debt: mockDebts[0] } }} navigation={mockNavigation} />
          </PaperProvider>
        </DebtContext.Provider>
      );

      expect(getByTestId('detail-title').props.children).toBe('Prestamo');
      expect(getByTestId('detail-amount').props.children).toEqual(expect.arrayContaining(['500.00']));
      expect(getByTestId('detail-type').props.children).toBe('Crédito');
      expect(getByTestId('detail-desc').props.children).toBe('Bank');
    });
  });
});
