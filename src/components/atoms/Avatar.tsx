import { View, Text, Image } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { dim: 32, text: 'text-sm' },
  md: { dim: 44, text: 'text-base' },
  lg: { dim: 64, text: 'text-xl' },
};

export const Avatar = ({ uri, name, size = 'md' }: AvatarProps) => {
  const { dim, text } = sizeMap[size];
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <View
      style={{ width: dim, height: dim, borderRadius: dim / 2 }}
      className="items-center justify-center bg-primary/20 overflow-hidden"
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: dim, height: dim }} />
      ) : (
        <Text className={`font-bold text-primary ${text}`}>{initials}</Text>
      )}
    </View>
  );
};
