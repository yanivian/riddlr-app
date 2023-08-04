import * as React from 'react'
import { useColorScheme } from 'react-native'
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'

const appLightTheme = {
  "colors": {
    "primary": "rgb(156, 65, 68)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(255, 218, 217)",
    "onPrimaryContainer": "rgb(65, 0, 9)",
    "secondary": "rgb(168, 54, 58)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(255, 218, 216)",
    "onSecondaryContainer": "rgb(65, 0, 7)",
    "tertiary": "rgb(156, 65, 70)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(255, 218, 217)",
    "onTertiaryContainer": "rgb(64, 0, 10)",
    "error": "rgb(183, 31, 41)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 215)",
    "onErrorContainer": "rgb(65, 0, 5)",
    "background": "rgb(255, 240, 240)",
    "onBackground": "rgb(32, 26, 26)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(32, 26, 26)",
    "surfaceVariant": "rgb(244, 221, 220)",
    "onSurfaceVariant": "rgb(82, 67, 67)",
    "outline": "rgb(133, 115, 114)",
    "outlineVariant": "rgb(215, 193, 193)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(54, 47, 46)",
    "inverseOnSurface": "rgb(251, 238, 237)",
    "inversePrimary": "rgb(255, 179, 179)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(250, 242, 246)",
      "level2": "rgb(247, 236, 240)",
      "level3": "rgb(244, 231, 234)",
      "level4": "rgb(243, 229, 233)",
      "level5": "rgb(241, 225, 229)"
    },
    "surfaceDisabled": "rgba(32, 26, 26, 0.12)",
    "onSurfaceDisabled": "rgba(32, 26, 26, 0.38)",
    "backdrop": "rgba(59, 45, 45, 0.4)"
  }
}

const appDarkTheme = {
  "colors": {
    "primary": "rgb(220, 180, 180)",
    "onPrimary": "rgb(95, 19, 26)",
    "primaryContainer": "rgb(126, 42, 47)",
    "onPrimaryContainer": "rgb(255, 218, 217)",
    "secondary": "rgb(255, 179, 176)",
    "onSecondary": "rgb(103, 2, 17)",
    "secondaryContainer": "rgb(135, 30, 37)",
    "onSecondaryContainer": "rgb(255, 218, 216)",
    "tertiary": "rgb(255, 179, 180)",
    "onTertiary": "rgb(95, 19, 28)",
    "tertiaryContainer": "rgb(126, 42, 48)",
    "onTertiaryContainer": "rgb(255, 218, 217)",
    "error": "rgb(255, 179, 174)",
    "onError": "rgb(104, 0, 12)",
    "errorContainer": "rgb(147, 0, 22)",
    "onErrorContainer": "rgb(255, 218, 215)",
    "background": "rgb(60, 40, 40)",
    "onBackground": "rgb(236, 224, 223)",
    "surface": "rgb(32, 26, 26)",
    "onSurface": "rgb(236, 224, 223)",
    "surfaceVariant": "rgb(82, 67, 67)",
    "onSurfaceVariant": "rgb(215, 193, 193)",
    "outline": "rgb(160, 140, 140)",
    "outlineVariant": "rgb(82, 67, 67)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(236, 224, 223)",
    "inverseOnSurface": "rgb(54, 47, 46)",
    "inversePrimary": "rgb(156, 65, 68)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(43, 34, 34)",
      "level2": "rgb(50, 38, 38)",
      "level3": "rgb(57, 43, 43)",
      "level4": "rgb(59, 44, 44)",
      "level5": "rgb(63, 47, 47)"
    },
    "surfaceDisabled": "rgba(236, 224, 223, 0.12)",
    "onSurfaceDisabled": "rgba(236, 224, 223, 0.38)",
    "backdrop": "rgba(59, 45, 45, 0.4)"
  }
}

interface AppThemeProps {
}

export default function AppTheme(props: React.PropsWithChildren<AppThemeProps>) {
  const isDarkMode = useColorScheme() === 'dark'
  const theme = {
    ...isDarkMode ? MD3DarkTheme : MD3LightTheme,
    colors: isDarkMode ? appDarkTheme.colors : appLightTheme.colors,
    roundness: 10,
  }

  return (
    <PaperProvider theme={theme}>
      {props.children}
    </PaperProvider>
  )
}