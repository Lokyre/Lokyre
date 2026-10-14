export type DebtType = 'Tarjetas' | 'Créditos' | 'Personas' | 'Individuales';

export interface Debt {
  id: string;
  name: string;
  amount: number;
  type: DebtType;
  dueDate: string;
  description?: string;
}
