import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../../App';

const mockDebts = [
  { id: '1', title: 'Prestamo Banco', amount: 500, type: 'Créditos', dueDate: '2025-12-31', status: 'Pendiente' },
  { id: '2', title: 'Tarjeta Visa', amount: 1500, type: 'Tarjetas', dueDate: '2024-01-01', status: 'Pendiente' },
];

describe('Debt App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders HomeScreen with empty debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); // No debts saved

    const { getByText, getByTestId, queryByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Mis Deudas')).toBeTruthy();
      expect(getByText('Total Pendiente')).toBeTruthy();
      expect(getByText('$0.00')).toBeTruthy();
      expect(getByText('0 deudas pendientes')).toBeTruthy();
    }, { timeout: 2000 });

    expect(getByTestId('fab-add')).toBeTruthy();
  });

  it('loads and displays saved debts correctly', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByText('$2000.00')).toBeTruthy(); // Total 500 + 1500
      expect(getByText('2 deudas pendientes')).toBeTruthy();
      expect(getByText('Tarjetas')).toBeTruthy();
      expect(getByText('$1500.00')).toBeTruthy(); // Total for Tarjetas
      expect(getByText('Créditos')).toBeTruthy();
      expect(getByText('$500.00')).toBeTruthy(); // Total for Créditos
    }, { timeout: 2000 });
  });

  it('navigates to AddEditDebt screen when FAB is pressed', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId, getByText, findByText } = render(<App />);

    await waitFor(() => expect(getByTestId('fab-add')).toBeTruthy());

    fireEvent.press(getByTestId('fab-add'));

    expect(await findByText('Nueva Deuda')).toBeTruthy();
    expect(await findByText('Guardar')).toBeTruthy();
  });

  it('navigates to DebtList and shows the debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));
    const { getByText, findByText } = render(<App />);

    // Wait for initial load
    await waitFor(() => expect(getByText('Ver Todo')).toBeTruthy());

    // Navigate to DebtList
    fireEvent.press(getByText('Ver Todo'));

    expect(await findByText('Lista de Deudas')).toBeTruthy();

    // Both items should be rendered
    expect(await findByText('Prestamo Banco')).toBeTruthy();
    expect(await findByText('Tarjeta Visa')).toBeTruthy();
  });
});
