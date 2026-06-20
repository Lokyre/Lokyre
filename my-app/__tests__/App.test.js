import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0) {
    const confirmButton = buttons.find(b => b.style === 'destructive' || b.text === 'Eliminar');
    if (confirmButton && confirmButton.onPress) {
      confirmButton.onPress();
    }
  }
});

describe('Debt Management Application', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
  });

  it('renders the initial empty state correctly', async () => {
    const { getByText, queryByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Mis Deudas')).toBeTruthy();
    expect(getByText('Total de Deudas Pendientes')).toBeTruthy();
    expect(queryByText('No tienes deudas registradas.')).toBeTruthy();
  });

  it('allows user to add a new debt and see it on the home screen', async () => {
    const { getByTestId, getAllByText, queryByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    const fab = getByTestId('fab');
    fireEvent.press(fab);

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.changeText(getByTestId('input-title'), 'Prestamo Banco');
    fireEvent.changeText(getByTestId('input-amount'), '1500');
    fireEvent.changeText(getByTestId('input-dueDate'), '2025-12-01');
    fireEvent.press(getByTestId('radio-credito'));

    fireEvent.press(getByTestId('btn-save'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(getAllByText('Mis Deudas')[0]).toBeTruthy();
    expect(getByTestId(/^debt-title-/)).toBeTruthy();
    expect(getAllByText('Prestamo Banco')[0]).toBeTruthy();
    expect(getAllByText('$1500.00')[0]).toBeTruthy();
    expect(queryByText('No tienes deudas registradas.')).toBeNull();
  });

  it('allows user to toggle paid status', async () => {
    const mockDebt = [{
      id: 'test-id-123',
      title: 'Tarjeta de Credito',
      amount: 500,
      type: 'Tarjeta',
      dueDate: '2024-05-01',
      description: '',
      isPaid: false
    }];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebt));

    const { getByTestId, getAllByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getAllByText('Tarjeta de Credito')[0]).toBeTruthy();
    expect(getAllByText('$500.00')[0]).toBeTruthy();

    const toggleButton = getByTestId('toggle-paid-test-id-123');
    fireEvent.press(toggleButton);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getAllByText('$0.00')[0]).toBeTruthy();
  });

  it('allows user to delete a debt', async () => {
    const mockDebt = [{
      id: 'test-id-123',
      title: 'Deuda a Eliminar',
      amount: 100,
      type: 'Persona',
      dueDate: '2024-05-01',
      description: '',
      isPaid: false
    }];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebt));

    const { getAllByText, getByTestId, queryByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getAllByText('Deuda a Eliminar')[0]).toBeTruthy();

    fireEvent.press(getAllByText('Deuda a Eliminar')[0]);

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByTestId('btn-delete'));

    await act(async () => {
      await Promise.resolve();
      await new Promise(r => setTimeout(r, 100)); // wait for navigation
    });

    expect(getAllByText('Mis Deudas')[0]).toBeTruthy();
    expect(queryByText('Deuda a Eliminar')).toBeNull();
    expect(getAllByText('No tienes deudas registradas.')[0]).toBeTruthy();
  });
});
