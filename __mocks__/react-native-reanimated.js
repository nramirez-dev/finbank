// Manual mock for react-native-reanimated v4 (Jest environment)
/* eslint-disable no-unused-vars */
const React = require('react');
const { View, Text, Image, ScrollView, FlatList } = require('react-native');

const mock = {
  default: {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    createAnimatedComponent: (component) => component,
  },
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  createAnimatedComponent: (component) => component,
  useSharedValue: (init) => ({ value: init }),
  useAnimatedStyle: (fn) => ({}),
  useAnimatedProps: (fn) => ({}),
  withTiming: (toValue) => toValue,
  withSpring: (toValue) => toValue,
  withDelay: (delay, anim) => anim,
  withSequence: (...anims) => anims[anims.length - 1],
  withRepeat: (anim) => anim,
  interpolate: (val, input, output) => output[0],
  Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  useDerivedValue: (fn) => ({ value: fn() }),
  useAnimatedScrollHandler: () => () => {},
  useAnimatedRef: () => ({ current: null }),
  scrollTo: () => {},
  measure: () => {},
  Easing: {
    linear: (t) => t,
    ease: (t) => t,
    quad: (t) => t,
    cubic: (t) => t,
    in: (easing) => easing,
    out: (easing) => easing,
    inOut: (easing) => easing,
  },
  ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
  cancelAnimation: () => {},
};

module.exports = mock;
