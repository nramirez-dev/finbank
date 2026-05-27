import { fireEvent, render } from '@testing-library/react-native';
import { Input } from '@/components/atoms/Input';

describe('Input', () => {
  it('renders label and error', () => {
    const { getByText } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => undefined}
        error="Required"
      />
    );

    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Required')).toBeTruthy();
  });

  it('calls onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        value=""
        onChangeText={onChangeText}
        placeholder="Email"
      />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    expect(onChangeText).toHaveBeenCalledWith('test@example.com');
  });

  it('handles focus and blur events', () => {
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={() => undefined} placeholder="Campo" />
    );
    const input = getByPlaceholderText('Campo');
    // covers onFocus (line 76) and onBlur (line 77)
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
  });

  it('renders without label using placeholder only', () => {
    const { getByPlaceholderText } = render(
      <Input value="hello" onChangeText={() => undefined} placeholder="Sin label" />
    );
    expect(getByPlaceholderText('Sin label')).toBeTruthy();
  });
});
