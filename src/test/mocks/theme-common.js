import { useState } from 'react'

export function useColorMode() {
  const [colorMode, setColorModeState] = useState('dark')
  return {
    colorMode,
    setColorMode: (mode) => setColorModeState(mode),
  }
}
