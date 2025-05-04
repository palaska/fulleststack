import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

export const tamaguiConfig = createTamagui(defaultConfig)

type TamaguiCustomConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends TamaguiCustomConfig {}
}

export type { TamaguiCustomConfig }
