import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDebts, saveDebt, deleteDebt } from '../src/services/storage';

jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets empty debts if none exist', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const debts = await getDebts();
    expect(debts).toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts_key');
  });

  it('saves a debt correctly', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('[]');
    const newDebt = { name: 'Test', amount: 100, category: 'Tarjetas' };

    await saveDebt(newDebt);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts_key',
      JSON.stringify([{ ...newDebt, id: 'test-uuid' }])
    );
  });

  it('deletes a debt correctly', async () => {
    const existingDebts = [
      { id: '1', name: 'Debt 1' },
      { id: '2', name: 'Debt 2' }
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingDebts));

    await deleteDebt('1');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts_key',
      JSON.stringify([{ id: '2', name: 'Debt 2' }])
    );
  });
});
