import { useEffect } from 'react'
import Link from '@docusaurus/Link'
import { useColorMode } from '@docusaurus/theme-common'
import SearchBar from '@theme/SearchBar'
import { MoonIcon, SunIcon } from '@site/src/components/ThemeIcons'

export const THEME_STORAGE_KEY = 'eld-docs-theme'

function persistTheme(isLight) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark')
  }
}

/**
 * Custom docs chrome navbar — sole color-mode control for this site.
 * themeConfig.colorMode.disableSwitch stays true so Infima's switch is not shown.
 * themeConfig.navbar stays minimal; links and search live here.
 */
export default function Navbar() {
  const { colorMode, setColorMode } = useColorMode()
  const isLight = colorMode === 'light'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    // Migrate legacy explorer/home key if present
    const legacy = window.localStorage.getItem('eld-home-theme')
    const preferred = stored ?? legacy
    setColorMode(preferred === 'light' ? 'light' : 'dark')
  }, [setColorMode])

  const handleThemeToggle = () => {
    const nextIsLight = !isLight
    persistTheme(nextIsLight)
    setColorMode(nextIsLight ? 'light' : 'dark')
  }

  return (
    <header className="navbar eld-docs-shell__header">
      <Link to="/" className="eld-docs-shell__brand">
        <span className="eld-docs-shell__brand-mark">E</span>
        <span className="eld-docs-shell__brand-text">
          <span>ELD</span>
          <span className="eld-docs-shell__brand-muted">{'//'}</span>
          <span className="eld-docs-shell__brand-muted">DOCS</span>
        </span>
      </Link>

      <nav className="eld-docs-shell__nav" aria-label="Site">
        <Link to="/" className="eld-docs-shell__nav-link">
          Docs
        </Link>
        <a
          href="https://github.com/eldnetwork"
          className="eld-docs-shell__nav-link"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
        <a
          href="https://www.eld.network"
          className="eld-docs-shell__nav-link"
          target="_blank"
          rel="noreferrer noopener"
        >
          Website
        </a>
        <a
          href="https://explorer.eld.network"
          className="eld-docs-shell__nav-link eld-docs-shell__nav-link--accent"
          target="_blank"
          rel="noreferrer noopener"
        >
          Explorer
        </a>
      </nav>

      <div className="eld-docs-shell__meta">
        <div className="eld-docs-shell__search">
          <SearchBar />
        </div>
        <button
          type="button"
          className="eld-docs-shell__theme-toggle"
          onClick={handleThemeToggle}
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {isLight ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  )
}
