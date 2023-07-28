import { useEffect, useState } from 'react'
import { MEDIA_WIDTHS } from '~/theme'

const isClient = typeof window !== 'undefined'

function getScreenSize(): Record<keyof typeof MEDIA_WIDTHS, boolean> {
  return Object.keys(MEDIA_WIDTHS).reduce(
    (obj, key) =>
      Object.assign(obj, {
        [key]: isClient ? window.innerWidth >= MEDIA_WIDTHS[key as keyof typeof MEDIA_WIDTHS] : false,
      }),
    {} as Record<keyof typeof MEDIA_WIDTHS, boolean>
  )
}

export function useScreenSize(): Record<keyof typeof MEDIA_WIDTHS, boolean> {
  const [screenSize, setScreenSize] = useState(getScreenSize())

  useEffect(() => {
    function handleResize() {
      setScreenSize(getScreenSize())
    }

    if (isClient) {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return undefined
  }, [])

  return screenSize
}
