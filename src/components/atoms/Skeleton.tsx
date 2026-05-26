import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export const Skeleton = ({ width = '100%', height = 16, borderRadius = 8, className }: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
    return () => {
      opacity.value = 0.3;
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: '#CBD5E1',
        },
        animatedStyle,
      ]}
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
