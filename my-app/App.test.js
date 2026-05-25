import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaInsetsContext: {
      Consumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    },
  };
});

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual('react-native-paper');
  const MockedProvider = ({ children }) => children;
  return {
    ...RealModule,
    Provider: MockedProvider,
  };
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and starts on Home screen', async () => {
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Resumen de Deudas')).toBeTruthy();
      expect(getByText('Agregar Deuda')).toBeTruthy();
    });
  });

  it('navigates to Add Debt screen, adds a debt and updates the total', async () => {
    const { getByText, getAllByTestId } = render(<App />);

    // Esperar a que renderice la pantalla de inicio
    await waitFor(() => {
      expect(getByText('Agregar Deuda')).toBeTruthy();
    });

    // Navegar a la pantalla de Agregar Deuda
    fireEvent.press(getByText('Agregar Deuda'));

    // Esperar a que la pantalla de Agregar Deuda se renderice
    await waitFor(() => {
      expect(getByText('Registrar Nueva Deuda')).toBeTruthy();
    });

    // Los TextInput de react-native-paper usan un View contenedor, por lo que buscamos el testID del input interno
    const inputs = getAllByTestId('text-input-outlined');
    const nameInput = inputs[0];
    const amountInput = inputs[1];

    fireEvent.changeText(nameInput, 'Juan Perez');
    fireEvent.changeText(amountInput, '100');

    // Seleccionar tipo de deuda
    const typeButton = getByText('Tarjeta');
    fireEvent.press(typeButton);

    // Guardar
    fireEvent.press(getByText('Guardar Deuda'));

    // Verificar que vuelve a la pantalla inicial y que el monto total fue actualizado
    await waitFor(() => {
      expect(getByText('$100.00')).toBeTruthy();
    });

    // Verificar que el storage haya sido llamado
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts',
      expect.stringContaining('Juan Perez')
    );
  });
});
