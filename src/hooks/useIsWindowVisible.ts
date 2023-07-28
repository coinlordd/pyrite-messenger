import { useCallback, useEffect, useState } from 'react'

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useIsWindowVisible(): boolean {
  const VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document

  function isWindowVisible() {
    return !VISIBILITY_STATE_SUPPORTED || document.visibilityState !== 'hidden'
  }

  const [focused, setFocused] = useState<boolean>(isWindowVisible())
  const listener = useCallback(() => {
    setFocused(isWindowVisible())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFocused])

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return undefined

    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
    }
  }, [listener, VISIBILITY_STATE_SUPPORTED])

  return focused
}
