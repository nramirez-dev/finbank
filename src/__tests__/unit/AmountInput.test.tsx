import { fireEvent, render } from '@testing-library/react-native';
import { AmountInput } from '@/components/molecules/AmountInput';

describe('AmountInput', () => {
  it('renders with initial zero value', () => {
    const { getByPlaceholderText } = render(
      <AmountInput value={0} onChangeValue={jest.fn()} />
    );
    expect(getByPlaceholderText('0.00')).toBeTruthy();
  });

  it('renders with a label', () => {
    const { getByText } = render(
      <AmountInput value={0} onChangeValue={jest.fn()} label="Monto" />
    );
    expect(getByText('Monto')).toBeTruthy();
  });

  it('calls onChangeValue when text changes', () => {
    const onChangeValue = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput value={0} onChangeValue={onChangeValue} />
    );
    fireEvent.changeText(getByPlaceholderText('0.00'), '150.50');
    expect(onChangeValue).toHaveBeenCalledWith(150.5);
  });

  it('updates internal text when value prop changes externally', () => {
    const { rerender, getByPlaceholderText } = render(
      <AmountInput value={0} onChangeValue={jest.fn()} />
    );
    // Rerender with a new value — triggers the useEffect setText branch (line 22)
    rerender(<AmountInput value={500} onChangeValue={jest.fn()} />);
    expect(getByPlaceholderText('0.00').props.value).toBe('500.00');
  });

  it('displays USD currency symbol', () => {
    const { getByText } = render(
      <AmountInput value={0} currency="USD" onChangeValue={jest.fn()} />
    );
    expect(getByText('$ ')).toBeTruthy();
  });
});
