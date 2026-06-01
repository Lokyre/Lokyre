import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';
import AddDebtScreen from './AddDebtScreen';
import { Provider as PaperProvider } from 'react-native-paper';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
  };
});

describe('AddDebtScreen', () => {
  it('calls addDebt and goes back on save', () => {
    const mockAddDebt = jest.fn();
    const { getByText, UNSAFE_getAllByType } = render(
      <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
        <PaperProvider>
          <NavigationContainer>
            <AddDebtScreen />
          </NavigationContainer>
        </PaperProvider>
      </DebtContext.Provider>
    );

    const { TextInput } = require('react-native-paper');
    const inputs = UNSAFE_getAllByType(TextInput);

    // title
    fireEvent.changeText(inputs[0], 'Nueva Deuda');
    // amount
    fireEvent.changeText(inputs[1], '500');
    // date
    fireEvent.changeText(inputs[2], '2025-01-01');

    fireEvent.press(getByText('Guardar Deuda'));

    expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Nueva Deuda',
      amount: '500',
      dueDate: '2025-01-01',
      type: 'Tarjeta' // default value
    }));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
