import { useThemeStore } from '@/store/useThemeStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiSet: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ isDarkMode: true });
  });

  it('initial state is dark mode', () => {
    expect(useThemeStore.getState().isDarkMode).toBe(true);
  });

  it('toggleDarkMode switches from true to false', () => {
    useThemeStore.getState().toggleDarkMode();
    expect(useThemeStore.getState().isDarkMode).toBe(false);
  });

  it('toggleDarkMode switches from false to true', () => {
    useThemeStore.setState({ isDarkMode: false });
    useThemeStore.getState().toggleDarkMode();
    expect(useThemeStore.getState().isDarkMode).toBe(true);
  });

  it('setDarkMode sets to false explicitly', () => {
    useThemeStore.getState().setDarkMode(false);
    expect(useThemeStore.getState().isDarkMode).toBe(false);
  });

  it('setDarkMode sets to true explicitly', () => {
    useThemeStore.setState({ isDarkMode: false });
    useThemeStore.getState().setDarkMode(true);
    expect(useThemeStore.getState().isDarkMode).toBe(true);
  });
});
