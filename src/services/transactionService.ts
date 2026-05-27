import type { Transaction } from '@/domain/entities/Transaction';
import type { TransferSchema } from '@/domain/schemas/transferSchema';
import transactionsData from '@/data/transactions.json';

const transactions = transactionsData as Transaction[];

export interface TransactionFilters {
  type?: Transaction['type'];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const transactionService = {
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    let result = [...transactions];

    if (filters?.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter((t) => t.description.toLowerCase().includes(query));
    }

    if (filters?.dateFrom) {
      const fromTime = new Date(filters.dateFrom).getTime();
      result = result.filter((t) => new Date(t.date).getTime() >= fromTime);
    }

    if (filters?.dateTo) {
      const toTime = new Date(filters.dateTo).getTime();
      result = result.filter((t) => new Date(t.date).getTime() <= toTime);
    }

    if (typeof filters?.minAmount === 'number') {
      const min = filters.minAmount;
      result = result.filter((t) => t.amount >= min);
    }

    if (typeof filters?.maxAmount === 'number') {
      const max = filters.maxAmount;
      result = result.filter((t) => t.amount <= max);
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getById: async (id: string): Promise<Transaction> => {
    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  },

  getRecent: async (limit = 5): Promise<Transaction[]> => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sorted.slice(0, limit);
  },

  simulateTransfer: async (data: TransferSchema): Promise<{ success: boolean; transactionId: string }> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    if (data.fromAccountId === data.toAccountId) {
      throw new Error('From and to accounts must be different');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    return {
      success: true,
      transactionId: `txn-${Date.now()}`,
    };
  },
};
