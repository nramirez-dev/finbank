import { ActivityIndicator } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '@/components/atoms/Button';

describe('Button', () => {
  it('renders label', () => {
    const { getByText } = render(<Button label="Enviar" onPress={() => undefined} />);

    expect(getByText('Enviar')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Confirmar" onPress={onPress} />);

    fireEvent.press(getByText('Confirmar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loader when loading', () => {
    const { UNSAFE_getByType } = render(
      <Button label="Cargando" onPress={() => undefined} loading />
    );

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('is disabled when disabled', () => {
    const { getByRole } = render(
      <Button label="Disabled" onPress={() => undefined} disabled />
    );

    const button = getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
