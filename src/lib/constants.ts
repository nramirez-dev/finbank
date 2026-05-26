export const QUERY_KEYS = {
  accounts: 'accounts',
  transactions: 'transactions',
  profile: 'profile',
} as const;

export const STALE_TIME = {
  short: 1000 * 60 * 1,   // 1 min
  medium: 1000 * 60 * 5,  // 5 min
  long: 1000 * 60 * 30,   // 30 min
} as const;

export const DEFAULT_PROFILE_ID = 'user-001';
