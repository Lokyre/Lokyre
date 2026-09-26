import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';
import { PaperProvider } from 'react-native-paper';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('HomeScreen', () => {
  it('renders correctly with debts', () => {
    const mockContextValue = {
      debts: [{ id: '1', title: 'Tarjeta Visa', amount: 500, type: 'Tarjetas', dueDate: '2024-05-01' }],
      totalDebt: 500,
      isLoaded: true,
    };

    const { getByText, getAllByText } = render(
      <PaperProvider>
        <DebtContext.Provider value={mockContextValue}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    expect(getByText('Tarjeta Visa')).toBeTruthy();
    expect(getAllByText('$500.00')[0]).toBeTruthy(); // Handle multiple matches
  });

  it('navigates to AddDebt screen when FAB is pressed', async () => {
    const mockContextValue = {
      debts: [],
      totalDebt: 0,
      isLoaded: true,
    };

    const { getByTestId } = render(
      <PaperProvider>
        <DebtContext.Provider value={mockContextValue}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    const fab = getByTestId('add-debt-fab');
    // Using fireEvent.press for standard native interaction
    fireEvent.press(fab);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
    });
  });
});