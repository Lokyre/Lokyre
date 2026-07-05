import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddEditDebtScreen from '../AddEditDebtScreen';
import { DebtProvider } from '../../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const mockNavigation = {
  goBack: jest.fn(),
};

describe('AddEditDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows error if required fields are empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <AddEditDebtScreen navigation={mockNavigation} route={{}} />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    fireEvent.press(getByTestId('btn-save'));
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('saves new debt when fields are filled', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <AddEditDebtScreen navigation={mockNavigation} route={{}} />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '500');
    fireEvent.changeText(getByTestId('input-date'), '01/01/2025');

    await act(async () => {
      fireEvent.press(getByTestId('btn-save'));
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
