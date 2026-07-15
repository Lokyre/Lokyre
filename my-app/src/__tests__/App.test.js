import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import App from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => {
      const Navigator = ({ children }) => <View>{React.Children.toArray(children)}</View>;
      const Screen = ({ component: Component }) => {
        const mockNavigation = {
          navigate: jest.fn(),
          goBack: jest.fn(),
        };
        return <Component navigation={mockNavigation} />;
      };
      return { Navigator, Screen };
    },
  };
});

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  // If there's an ok button or similar we can just call it
  // But for simple validation, mocking is enough to stop it hanging
});

describe('App - Debt Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
  });

  it('renders HomeScreen initially without debts', async () => {
    const { getByText, getByTestId, queryByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Total Pendiente')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByTestId('fab')).toBeTruthy();
  });

  it('allows adding a new debt', async () => {
    const { getByTestId, getByText, queryByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    // We navigate to AddDebt via the FAB in reality, but our mock Navigator renders all screens.
    // So both screens are mounted. We can just fill out the AddDebt form directly.

    const titleInput = getByTestId('input-title');
    const amountInput = getByTestId('input-amount');
    const saveButton = getByTestId('btn-save');

    fireEvent.changeText(titleInput, 'Nueva Laptop');
    fireEvent.changeText(amountInput, '1500');

    fireEvent.press(saveButton);

    await act(async () => {
      await Promise.resolve();
    });

    // Check if debt is rendered
    expect(getByText('Nueva Laptop')).toBeTruthy();
    expect(getByText('Tarjeta - $1500')).toBeTruthy();
    expect(getByText('$1500.00')).toBeTruthy();
  });

  it('toggles debt paid status', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{
      id: '123',
      title: 'Deuda Prueba',
      amount: 500,
      type: 'Crédito',
      isPaid: false,
    }]));

    const { getByTestId, getByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('$500.00')).toBeTruthy();

    const toggleButton = getByTestId('toggle-paid-123');
    fireEvent.press(toggleButton);

    await act(async () => {
      await Promise.resolve();
    });

    // Once paid, it shouldn't be in the pending total
    expect(getByText('$0.00')).toBeTruthy();
  });
});
