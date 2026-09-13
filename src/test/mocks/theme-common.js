import { useCallback, useState } from 'react'

export function useColorMode() {
  const [colorMode, setColorModeState] = useState('dark')
  const setColorMode = useCallback((mode) => {
    setColorModeState(mode)
  }, [])
  return {
    colorMode,
    setColorMode,
  }
}
