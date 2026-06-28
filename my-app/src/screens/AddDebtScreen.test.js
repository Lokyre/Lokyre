import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddDebtScreen from './AddDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    }),
  };
});

describe('AddDebtScreen', () => {
  const mockAddDebt = jest.fn();

  const renderWithContext = () => {
    return render(
      <NavigationContainer>
        <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
          <AddDebtScreen />
        </DebtContext.Provider>
      </NavigationContainer>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('submits a new debt successfully', async () => {
    const { getByTestId } = renderWithContext();

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '150');

    await act(async () => {
      fireEvent.press(getByTestId('btn-submit'));
    });

    expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Debt',
      amount: 150,
      type: 'Individual', // Default type
    }));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows alert when title or amount is missing', async () => {
    const { getByTestId } = renderWithContext();

    await act(async () => {
      fireEvent.press(getByTestId('btn-submit'));
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa al menos el título y el monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });
});
