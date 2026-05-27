import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) => {
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
    return () => {
      opacity.value = 0.5;
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: '#334155',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const SkeletonRow = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 12 }}>
    <Skeleton width={44} height={44} borderRadius={22} />
    <View style={{ flex: 1, gap: 8 }}>
      <Skeleton height={14} borderRadius={6} />
      <Skeleton width="60%" height={12} borderRadius={6} />
    </View>
    <Skeleton width={70} height={14} borderRadius={6} />
  </View>
);
