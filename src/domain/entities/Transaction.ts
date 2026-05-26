export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO 8601
  type: 'depósito' | 'retiro' | 'transferencia';
  fromAccountId: string;
  toAccountId: string;
  description: string;
}
