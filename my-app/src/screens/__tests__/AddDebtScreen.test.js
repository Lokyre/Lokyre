import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddDebtScreen from '../AddDebtScreen';
import { DebtContext } from '../../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const mockGoBack = jest.fn();
const mockAddDebt = jest.fn();

const renderWithContext = () => {
  return render(
    <NavigationContainer>
      <PaperProvider>
        <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
          <AddDebtScreen navigation={{ goBack: mockGoBack }} />
        </DebtContext.Provider>
      </PaperProvider>
    </NavigationContainer>
  );
};

describe('AddDebtScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs correctly', async () => {
    const component = renderWithContext();
    await act(async () => { await Promise.resolve(); });

    const { getByTestId } = component;
    expect(getByTestId('input-title')).toBeTruthy();
    expect(getByTestId('input-amount')).toBeTruthy();
    expect(getByTestId('radio-tarjeta')).toBeTruthy();
    expect(getByTestId('save-button')).toBeTruthy();
  });

  it('validates input and alerts if missing title or amount', async () => {
    const component = renderWithContext();
    await act(async () => { await Promise.resolve(); });

    const { getByTestId } = component;

    // global.alert is not available in jest environment, but React Native has its own polyfill or we can just spy on it
    global.alert = jest.fn();
    const alertSpy = jest.spyOn(global, 'alert');

    await act(async () => {
      fireEvent.press(getByTestId('save-button'));
    });

    expect(alertSpy).toHaveBeenCalledWith('Please enter a valid title and amount.');
    expect(mockAddDebt).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });


});
