import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export const Skeleton = ({ width = '100%', height = 16, borderRadius = 8, className }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: width as number,
        height,
        borderRadius,
        opacity,
        backgroundColor: '#CBD5E1',
      }}
      className={className}
    />
  );
};

export const SkeletonRow = () => (
  <View className="flex-row items-center gap-3 px-4 py-3">
    <Skeleton width={44} height={44} borderRadius={22} />
    <View className="flex-1 gap-2">
      <Skeleton height={14} borderRadius={6} />
      <Skeleton width="60%" height={12} borderRadius={6} />
    </View>
    <Skeleton width={70} height={14} borderRadius={6} />
  </View>
);
