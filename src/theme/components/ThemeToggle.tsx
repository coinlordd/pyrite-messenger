import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Sun, Moon } from 'react-feather'

import { addMediaQueryListener, removeMediaQueryListener } from '~/utils/matchMedia'
import { RowBetween } from '../../components/Common/Row'

const THEME_UPDATE_DELAY_MS = 100
const DARKMODE_MEDIA_QUERY =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : undefined

export enum ThemeMode {
  LIGHT,
  DARK,
}

// Tracks the device theme
const systemThemeAtom = atom<ThemeMode.LIGHT | ThemeMode.DARK>(
  DARKMODE_MEDIA_QUERY === undefined ? ThemeMode.DARK : DARKMODE_MEDIA_QUERY.matches ? ThemeMode.DARK : ThemeMode.LIGHT
)

// Tracks the user's selected theme mode
const themeModeAtom = atomWithStorage<ThemeMode>('interface_color_theme', ThemeMode.DARK)

export function SystemThemeUpdater() {
  const setSystemTheme = useSetAtom(systemThemeAtom)

  const listener = useCallback(
    (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? ThemeMode.DARK : ThemeMode.LIGHT)
    },
    [setSystemTheme]
  )

  useEffect(() => {
    addMediaQueryListener(DARKMODE_MEDIA_QUERY, listener)
    return () => removeMediaQueryListener(DARKMODE_MEDIA_QUERY, listener)
  }, [setSystemTheme, listener])

  return null
}

export function useIsDarkMode(): boolean {
  const mode = useAtomValue(themeModeAtom)
  return mode === ThemeMode.DARK
}

export function useDarkModeManager(): [boolean, (mode: ThemeMode) => void] {
  const isDarkMode = useIsDarkMode()
  const setMode = useSetAtom(themeModeAtom)

  return useMemo(() => {
    return [isDarkMode, setMode]
  }, [isDarkMode, setMode])
}

const Row = styled(RowBetween)`
  width: fit-content;
  border-radius: 10px;
  gap: 2px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.backgroundInteractive};
  background-color: ${({ theme }) => theme.background};
  height: 3rem;
`

const Segment = styled.div<{
  $active: boolean
}>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  overflow: hidden;
  cursor: pointer;

  background-color: ${({ theme, $active }) => ($active ? theme.accentActionSoft : theme.background)};
  color: ${({ theme, $active }) => ($active ? theme.accentAction : theme.textSecondary)};

  :hover {
    background-color: ${({ theme, $active }) => $active && theme.backgroundInteractive};
    color: ${({ theme, $active }) => ($active ? theme.textSecondary : theme.accentActive)};
  }

  transition: ${({ theme }) => theme.transition.duration.medium} ${({ theme }) => theme.transition.timing.ease};
`

const Icon = styled.div<{
  $active: boolean
}>`
  display: flex;
  padding: 6px;
`

export default function ThemeToggle({ disabled }: { disabled?: boolean }) {
  const [mode, setMode] = useAtom(themeModeAtom)
  const switchMode = useCallback(
    (mode: ThemeMode) => {
      !disabled && setTimeout(() => setMode(mode), THEME_UPDATE_DELAY_MS)
    },
    [disabled, setMode]
  )

  return (
    <Row>
      <Segment $active={mode === ThemeMode.LIGHT} onClick={() => switchMode(ThemeMode.LIGHT)}>
        <Icon $active={mode === ThemeMode.LIGHT}>
          <Sun size={16} stroke="currentColor" />
        </Icon>
      </Segment>
      <Segment $active={mode === ThemeMode.DARK} onClick={() => switchMode(ThemeMode.DARK)}>
        <Icon $active={mode === ThemeMode.DARK}>
          <Moon size={16} stroke="currentColor" />
        </Icon>
      </Segment>
    </Row>
  )
}
