import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

const localStore = new Map()

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key) => (localStore.has(key) ? localStore.get(key) : null),
    setItem: (key, value) => {
      localStore.set(key, String(value))
    },
    removeItem: (key) => {
      localStore.delete(key)
    },
    clear: () => {
      localStore.clear()
    },
  },
})

beforeEach(() => {
  localStore.clear()
})

afterEach(() => {
  cleanup()
})
