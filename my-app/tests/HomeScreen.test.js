import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockDebts = [
    {
      id: '1',
      title: 'Deuda Prueba 1',
      amount: '100',
      type: 'Tarjeta',
      dueDate: '12/12/2024',
      isPaid: false,
    },
    {
      id: '2',
      title: 'Deuda Prueba 2',
      amount: '50',
      type: 'Persona',
      dueDate: '10/10/2024',
      isPaid: true,
    }
  ];

  const renderComponent = () => {
    return render(
      <PaperProvider>
        <DebtContext.Provider value={{ debts: mockDebts }}>
          <HomeScreen navigation={{ navigate: mockNavigate }} />
        </DebtContext.Provider>
      </PaperProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with debts and total amount', async () => {
    const { getByText, queryByText } = renderComponent();

    // The component may do state updates, so we wait for them to finish
    await act(async () => {
      await Promise.resolve();
    });

    // We expect the total to only include the unpaid debt (id 1, amount 100)
    expect(getByText('Total Pendiente: $100.00')).toBeTruthy();

    // Check if debt titles are rendered
    expect(getByText('Deuda Prueba 1')).toBeTruthy();
    expect(getByText('Deuda Prueba 2')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen when FAB is pressed', async () => {
    const { getByTestId } = renderComponent();

    await act(async () => {
      await Promise.resolve();
    });

    const fab = getByTestId('fab');
    fireEvent.press(fab);

    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebtScreen');
  });

  it('navigates to DebtDetailScreen when a debt card is pressed', async () => {
    const { getByTestId } = renderComponent();

    await act(async () => {
      await Promise.resolve();
    });

    const card = getByTestId('debt-card-1');
    fireEvent.press(card);

    expect(mockNavigate).toHaveBeenCalledWith('DebtDetailScreen', { id: '1' });
  });
});
