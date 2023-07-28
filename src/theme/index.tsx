import React, { useMemo } from 'react'
import { createGlobalStyle, css, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import { useIsDarkMode } from './components/ThemeToggle'
import { transition } from './transition'
import { darkTheme, lightTheme } from './colors'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
  upToExtraLarge: 1820,
}

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css
} = Object.keys(MEDIA_WIDTHS).reduce((acc, size) => {
  acc[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `
  return acc
}, {} as any)

const fonts = {
  code: 'courier, courier new, serif',
}

function getSettings() {
  return {
    grids: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '24px',
      xl: '32px',
    },
    fonts,
    transition,
    navHeight: 72,
    mediaWidth: mediaWidthTemplates,
  }
}

export function getTheme(darkMode: boolean) {
  return {
    darkMode,
    ...(darkMode ? darkTheme : lightTheme),
    ...getSettings(),
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()
  const themeObject = useMemo(() => getTheme(darkMode), [darkMode])
  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

export const ThemedGlobalStyle = createGlobalStyle`
  * {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;         /* Opera/IE 8+ */
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */

    /* Scrollbar */
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
  }

  *::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  body {
    --w3m-z-index: 1500;
  }
  
  button {
    user-select: none;
  }
  
  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  html {
    font-size: 1rem;
    font-variant: none;
    font-smooth: always;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    color: ${({ theme }) => theme.textPrimary};
    background-color: ${({ theme }) => theme.background} !important;

    a {
      color: inherit;
      text-decoration: none;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 0.6rem;
    `}

    ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 0.7rem;
    `}

    ${({ theme }) => theme.mediaWidth.upToMedium`
      font-size: 0.8rem;
    `}

    ${({ theme }) => theme.mediaWidth.upToLarge`
      font-size: 0.9rem;
    `}
  }
`
