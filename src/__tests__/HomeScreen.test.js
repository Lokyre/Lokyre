import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Alert } from 'react-native';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';

jest.spyOn(Alert, 'alert').mockImplementation((title, msg, btns) => {
  btns.find(b => b.text === 'Eliminar')?.onPress();
});

const mockNavigation = { navigate: jest.fn() };

const theme = { ...DefaultTheme };

describe('HomeScreen', () => {
  const mockDebts = [
    { id: '1', name: 'Debt 1', amount: 100, isPaid: false, type: 'Personal', dueDate: '12/12/2024' },
    { id: '2', name: 'Debt 2', amount: 200, isPaid: true, type: 'Tarjeta', dueDate: '10/12/2024' },
  ];

  const mockContext = {
    debts: mockDebts,
    deleteDebt: jest.fn(),
    togglePaidStatus: jest.fn(),
  };

  const renderComponent = () =>
    render(
      <PaperProvider theme={theme}>
        <DebtContext.Provider value={mockContext}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

  it('renders correct total pending amount', () => {
    const { getAllByText } = renderComponent();
    expect(getAllByText('$100.00').length).toBeGreaterThan(0);
  });

  it('navigates to DebtForm on FAB press', () => {
    const { getByTestId } = renderComponent();
    fireEvent.press(getByTestId('fab-add-debt'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtForm');
  });

  it('toggles debt status when check button is pressed', () => {
    const { getByTestId } = renderComponent();
    fireEvent.press(getByTestId('toggle-status-1'));
    expect(mockContext.togglePaidStatus).toHaveBeenCalledWith('1');
  });

  it('deletes debt when delete button is pressed', () => {
    const { getByTestId } = renderComponent();
    fireEvent.press(getByTestId('delete-btn-1'));
    expect(Alert.alert).toHaveBeenCalled();
    expect(mockContext.deleteDebt).toHaveBeenCalledWith('1');
  });
});
