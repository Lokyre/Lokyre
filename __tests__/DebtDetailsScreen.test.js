import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import DebtDetailsScreen from '../src/screens/DebtDetailsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MockContext = ({ children }) => (
  <DebtContext.Provider value={{
    debts: [
      { id: '1', title: 'Test Debt', amount: 100, category: 'Tarjetas', date: new Date().toISOString() }
    ],
    deleteDebt: jest.fn()
  }}>
    {children}
  </DebtContext.Provider>
);

const renderWithContext = async (ui) => {
  let result;
  await act(async () => {
    result = render(
      <MockContext>
        <PaperProvider>
          {ui}
        </PaperProvider>
      </MockContext>
    );
  });
  return result;
};

describe('DebtDetailsScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders correctly with existing debt', async () => {
    await renderWithContext(<DebtDetailsScreen route={{ params: { id: '1' } }} navigation={{ goBack: jest.fn(), navigate: jest.fn() }} />);

    expect(screen.getAllByText('Test Debt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tarjetas').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0);
  });
});
