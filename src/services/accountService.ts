import type { Account } from '@/domain/entities/Account';
import accountsData from '@/data/accounts.json';

const accounts = accountsData as Account[];

export const accountService = {
  getAll: async (): Promise<Account[]> => {
    return accounts;
  },

  getById: async (id: string): Promise<Account> => {
    const account = accounts.find((a) => a.id === id);

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  },

  getByOwnerId: async (ownerId: string): Promise<Account[]> => {
    return accounts.filter((a) => a.ownerId === ownerId);
  },
};
