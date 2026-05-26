export interface Account {
  id: string;
  balance: number;
  currency: 'DOP' | 'USD';
  type: 'ahorros' | 'corriente';
  ownerId: string;
}
