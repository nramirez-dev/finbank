import { useAppStore } from '@/store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ activeProfileId: 'user-001', selectedAccountId: null });
  });

  it('sets active profile', () => {
    useAppStore.getState().setActiveProfile('user-002');
    expect(useAppStore.getState().activeProfileId).toBe('user-002');
  });

  it('sets selected account', () => {
    useAppStore.getState().setSelectedAccount('acc-001');
    expect(useAppStore.getState().selectedAccountId).toBe('acc-001');
  });

  it('clears selected account', () => {
    useAppStore.getState().setSelectedAccount('acc-001');
    useAppStore.getState().setSelectedAccount(null);
    expect(useAppStore.getState().selectedAccountId).toBeNull();
  });
});
