import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { SymbolView } from "expo-symbols";

// A gradient icon component that uses MaskedView to apply gradient to icons
export function GradientIcon({
  name,
  size = 24,
  style,
  color,
  gradientStart,
  gradientEnd,
}: {
  name: React.ComponentProps<typeof SymbolView>["name"];
  size?: number;
  style?: any;
  color?: string;
  gradientStart: string;
  gradientEnd: string;
}) {
  // Create a simple fixed-size container to ensure proper layout
  return (
    <View style={[{ width: size, height: size }, style]}>
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <SymbolView size={size} name={name} tintColor={color} />
            {/* <Ionicons name={name} size={size} color="black" /> */}
          </View>
        }
      >
        <LinearGradient
          colors={[gradientStart, gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </View>
  );
}
