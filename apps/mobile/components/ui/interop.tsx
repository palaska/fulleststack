import { Picker as RNPicker } from "@react-native-picker/picker";
import {
  FlashList as ShopifyFlashList,
  FlashListProps,
} from "@shopify/flash-list";
import * as AvatarPrimitive from "@rn-primitives/avatar";
import { cssInterop } from "nativewind";
import React from "react";
import {
  Pressable as RNPressable,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
  ScrollView as RNScrollView,
  TouchableOpacity as RNTouchableOpacity,
} from "react-native";
import Animated from "react-native-reanimated";
import { Image as RNImage } from "expo-image";
import { BlurView as ExpoBlurView } from "expo-blur";

export const Image = cssInterop(RNImage, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof RNImage> & {
    className?: string;
  } & React.RefAttributes<RNImage>
>;

export const TouchableOpacity = cssInterop(RNTouchableOpacity, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof RNTouchableOpacity> & {
    className?: string;
  } & React.RefAttributes<React.ElementRef<typeof RNTouchableOpacity>>
>;

export const Pressable = cssInterop(RNPressable, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof RNPressable> & {
    className?: string;
  } & React.RefAttributes<RNView>
>;

export const AnimatedText = cssInterop(Animated.Text, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof Animated.Text> & {
    className?: string;
  } & React.RefAttributes<RNText>
>;

export const AnimatedView = cssInterop(Animated.View, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof Animated.View> & {
    className?: string;
  } & React.RefAttributes<RNView>
>;

export const View = cssInterop(RNView, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof RNView> & {
    className?: string;
  } & React.RefAttributes<RNView>
>;

export const ScrollView = cssInterop(RNScrollView, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof RNScrollView> & {
    className?: string;
  } & React.RefAttributes<RNScrollView>
>;

export const TextInput = cssInterop(RNTextInput, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof RNTextInput> & {
    className?: string;
  } & React.RefAttributes<RNTextInput>
>;

export const AvatarPrimitiveRoot = cssInterop(AvatarPrimitive.Root, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    className?: string;
  } & React.RefAttributes<React.ElementRef<typeof AvatarPrimitive.Root>>
>;

export const FlashList = cssInterop(ShopifyFlashList, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
}) as React.ForwardRefExoticComponent<
  FlashListProps<any> & {
    className?: string;
    contentContainerClassName?: string;
  } & React.RefAttributes<ShopifyFlashList<any>>
>;

export const BlurView = cssInterop(ExpoBlurView, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof ExpoBlurView> & {
    className?: string;
  } & React.RefAttributes<React.ElementRef<typeof ExpoBlurView>>
>;

export const Picker = cssInterop(RNPicker, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof RNPicker> & {
    className?: string;
  } & React.RefAttributes<React.ElementRef<typeof RNPicker>>
>;
