import React from 'react'
import Link from '@docusaurus/Link'
import { useColorMode } from '@docusaurus/theme-common'
import { MoonIcon, SunIcon } from '@site/src/components/ThemeIcons'

function persistTheme(isLight) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('eld-home-theme', isLight ? 'light' : 'dark')
  }
}

/**
 * Custom shell navbar — sole color-mode control for this site.
 * themeConfig.colorMode.disableSwitch stays true so Infima's switch is not shown.
 */
export default function Navbar() {
  const { colorMode, setColorMode } = useColorMode()
  const isLight = colorMode === 'light'

  const handleThemeToggle = () => {
    const nextIsLight = !isLight
    persistTheme(nextIsLight)
    setColorMode(nextIsLight ? 'light' : 'dark')
  }

  return (
    <header className="navbar explorer-home-shell__header">
      <Link to="/" className="explorer-home-shell__brand">
        <span className="explorer-home-shell__brand-mark">E</span>
        <span className="explorer-home-shell__brand-text">
          <span>ELD</span>
          <span className="explorer-home-shell__brand-muted">{'//'}</span>
          <span className="explorer-home-shell__brand-muted">DOCS</span>
        </span>
      </Link>

      <div className="explorer-home-shell__meta">
        <button
          type="button"
          className="explorer-home-shell__theme-toggle"
          onClick={handleThemeToggle}
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {isLight ? <MoonIcon /> : <SunIcon />}
        </button>
        <a
          href="https://explorer.eld.network"
          className="explorer-home-shell__intro-link"
          target="_blank"
          rel="noreferrer noopener"
        >
          ELD BLOCKCHAIN EXPLORER -&gt;
        </a>
      </div>
    </header>
  )
}
