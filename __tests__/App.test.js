import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider } from '../src/context/DebtContext';
import HomeScreen from '../src/screens/HomeScreen';
import DebtFormScreen from '../src/screens/DebtFormScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const renderWithContext = (ui) => {
  return render(
    <DebtProvider>
      <PaperProvider>
        {ui}
      </PaperProvider>
    </DebtProvider>
  );
};

describe('Debt Tracking App', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
  });

  test('HomeScreen displays empty state initially', async () => {
    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('No tienes deudas registradas.')).toBeTruthy();
    });
  });

  test('DebtFormScreen renders inputs and saves debt', async () => {
    const { getByTestId } = renderWithContext(
      <DebtFormScreen navigation={mockNavigation} route={{}} />
    );

    const nameInput = getByTestId('name-input');
    const amountInput = getByTestId('amount-input');
    const saveButton = getByTestId('save-button');

    fireEvent.changeText(nameInput, 'Deuda de Prueba');
    fireEvent.changeText(amountInput, '150.50');

    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  test('HomeScreen displays added debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
      { id: '1', name: 'Alquiler', amount: 500, type: 'Personal', isPaid: false }
    ]));

    const { getByText, getAllByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Alquiler')).toBeTruthy();
      expect(getAllByText('Pendiente').length).toBeGreaterThan(0);
    });
  });

  test('Toggles debt status from Pending to Paid', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
      { id: '2', name: 'Internet', amount: 30, type: 'Tarjeta', isPaid: false }
    ]));

    const { getByText, getByTestId, getAllByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Internet')).toBeTruthy();
    });

    const toggleButton = getByTestId('toggle-status-2');
    fireEvent.press(toggleButton);

    // After state update, it should show Pagado
    await waitFor(() => {
      expect(getAllByText('Pagado').length).toBeGreaterThan(0);
    });
  });

  test('Deletes a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
      { id: '3', name: 'Luz', amount: 40, type: 'Tarjeta', isPaid: false }
    ]));

    const { getByText, queryByText, getByTestId } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Luz')).toBeTruthy();
    });

    const deleteButton = getByTestId('delete-debt-3');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('Luz')).toBeNull();
    });
  });
});
