import { render } from '@testing-library/react-native';
import { TransferErrorCard } from '@/components/molecules/TransferErrorCard';

describe('TransferErrorCard', () => {
  it('renders default title and message', () => {
    const { getByText } = render(<TransferErrorCard />);
    expect(getByText('Transferencia fallida')).toBeTruthy();
    expect(getByText('No pudimos completar la transferencia. Intenta de nuevo.')).toBeTruthy();
  });

  it('renders custom title and message', () => {
    const { getByText } = render(
      <TransferErrorCard title="Error de red" message="Sin conexión a internet" />
    );
    expect(getByText('Error de red')).toBeTruthy();
    expect(getByText('Sin conexión a internet')).toBeTruthy();
  });

  it('renders only custom message with default title', () => {
    const { getByText } = render(<TransferErrorCard message="Fondos insuficientes" />);
    expect(getByText('Transferencia fallida')).toBeTruthy();
    expect(getByText('Fondos insuficientes')).toBeTruthy();
  });
});
