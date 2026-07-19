import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  const renderWithContext = (debts, isLoading = false) => {
    // Explicitly import the original context provider for testing if needed
    // or just pass a mock context provider for testing isolated screen
    const { DebtProvider } = require('../context/DebtContext');

    // Instead of DebtProvider which uses AsyncStorage, provide a custom mock Context provider
    const { DebtContext } = require('../context/DebtContext');
    // But since DebtContext is not exported directly we can mock the hook
    const DebtContextMock = React.createContext();

    return render(
      <DebtContextMock.Provider value={{ debts, isLoading, toggleDebtStatus: jest.fn() }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContextMock.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the hook directly for this test suite
    const DebtContextModule = require('../context/DebtContext');
    jest.spyOn(DebtContextModule, 'useDebtContext').mockImplementation(() => ({
      debts: [],
      isLoading: false,
      toggleDebtStatus: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading indicator when loading', () => {
    const DebtContextModule = require('../context/DebtContext');
    jest.spyOn(DebtContextModule, 'useDebtContext').mockImplementation(() => ({
      debts: [],
      isLoading: true,
      toggleDebtStatus: jest.fn(),
    }));

    const { UNSAFE_getByType } = render(<HomeScreen navigation={mockNavigation} />);
    const ActivityIndicator = require('react-native-paper').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders empty state correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('No debts found. Add one!')).toBeTruthy();
    expect(getByText('Total Pending: $0.00')).toBeTruthy();
  });

  it('renders debts and calculates total correctly', () => {
    const mockDebts = [
      { id: '1', title: 'Car Loan', amount: 500, isPaid: false },
      { id: '2', title: 'Credit Card', amount: 300, isPaid: true },
    ];

    const DebtContextModule = require('../context/DebtContext');
    jest.spyOn(DebtContextModule, 'useDebtContext').mockImplementation(() => ({
      debts: mockDebts,
      isLoading: false,
      toggleDebtStatus: jest.fn(),
    }));

    const { getByTestId, getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // Total should only include unpaid (500)
    expect(getByText('Total Pending: $500.00')).toBeTruthy();

    // Check if debt titles are rendered
    expect(getByTestId('debt-title-1').props.children).toBe('Car Loan');
    expect(getByTestId('debt-title-2').props.children).toBe('Credit Card');
  });

  it('navigates to AddEditDebt screen when FAB is pressed', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByTestId('fab'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
