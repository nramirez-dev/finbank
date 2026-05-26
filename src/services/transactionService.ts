import type { Transaction } from '@/domain/entities/Transaction';
import transactionsData from '@/data/transactions.json';

const transactions = transactionsData as Transaction[];

export interface TransactionFilters {
  accountId?: string;
  type?: Transaction['type'];
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export const transactionService = {
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    let result = [...transactions];

    if (filters?.accountId) {
      result = result.filter(
        (t) => t.fromAccountId === filters.accountId || t.toAccountId === filters.accountId
      );
    }

    if (filters?.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter((t) => t.description.toLowerCase().includes(query));
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getById: async (id: string): Promise<Transaction | undefined> => {
    return transactions.find((t) => t.id === id);
  },
};
