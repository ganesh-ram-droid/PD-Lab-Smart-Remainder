import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const ShimmerBlock = ({ className = '', style = {} }) => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true
        })
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View className={`rounded-2xl bg-slate-200 ${className}`} style={[style, { opacity }]} />;
};

const ShimmerLoader = ({ rows = 3 }) => {
  return (
    <View className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <ShimmerBlock key={index} className="h-16" />
      ))}
    </View>
  );
};

export { ShimmerBlock };
export default ShimmerLoader;
