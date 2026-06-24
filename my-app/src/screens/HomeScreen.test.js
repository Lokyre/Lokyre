import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text } from 'react-native';

const mockNavigation = {
  navigate: jest.fn()
};

const defaultContextValue = {
  debts: [
    { id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta', isPaid: false },
    { id: '2', title: 'Debt 2', amount: 50, type: 'Persona', isPaid: true },
  ],
  loading: false
};

const renderScreen = (contextValue = defaultContextValue) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={contextValue}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when loading', () => {
    const { UNSAFE_getByType } = renderScreen({ ...defaultContextValue, loading: true });
    expect(UNSAFE_getByType(require('react-native-paper').ActivityIndicator)).toBeTruthy();
  });

  it('renders debts and total pending amount', () => {
    const { getByText, getByTestId, getAllByText } = renderScreen();
    expect(getByText('$100.00')).toBeTruthy(); // Only Debt 1 is pending

    // In React Native Paper mock, Card.Title renders its strings in Views, not Texts.
    // `getByText` only finds text inside `<Text>` nodes in Testing Library React Native.
    // Instead we can test that the mock card contains them via querying the mount tree or matching strings in amount

    expect(getByTestId('debt-amount-1').children.join('')).toContain('100');
    expect(getByTestId('debt-amount-2').children.join('')).toContain('50');

    expect(getAllByText('Pendiente')).toBeTruthy();
    expect(getAllByText('Pagada')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', () => {
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });

  it('navigates to DebtDetail on card press', () => {
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('debt-card-1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { id: '1' });
  });
});
