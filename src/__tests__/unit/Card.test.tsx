import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Card } from '@/components/atoms/Card';

describe('Card', () => {
  it('renders children inside a View when no onPress', () => {
    const { getByText } = render(<Card><Text>Hello card</Text></Card>);
    expect(getByText('Hello card')).toBeTruthy();
  });

  it('renders as Pressable and fires onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Card onPress={onPress}><Text>Clickable</Text></Card>
    );
    fireEvent.press(getByText('Clickable'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('applies elevated styles', () => {
    const { getByText } = render(<Card elevated><Text>Elevated</Text></Card>);
    expect(getByText('Elevated')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <Card className="border border-red-500"><Text>Styled</Text></Card>
    );
    expect(getByText('Styled')).toBeTruthy();
  });
});
