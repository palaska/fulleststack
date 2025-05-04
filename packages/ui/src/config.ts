import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

export const tamaguiConfig = createTamagui(defaultConfig);

type TamaguiCustomConfig = typeof tamaguiConfig;

export type { TamaguiCustomConfig };
