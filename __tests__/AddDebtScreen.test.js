import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { DebtProvider } from '../src/context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import AddDebtScreen from '../src/screens/AddDebtScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const renderWithContext = async (ui) => {
  let result;
  await act(async () => {
    result = render(
      <DebtProvider>
        <PaperProvider>
          {ui}
        </PaperProvider>
      </DebtProvider>
    );
  });
  return result;
};

describe('AddDebtScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders input fields correctly', async () => {
    await renderWithContext(<AddDebtScreen route={{ params: {} }} navigation={{ goBack: jest.fn() }} />);

    expect(screen.getAllByText('Título (Ej. Tarjeta Visa)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Monto').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Categoría:').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Notas Adicionales').length).toBeGreaterThan(0);
  });
});
