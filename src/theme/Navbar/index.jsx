import { useEffect, useId, useState } from 'react'
import Link from '@docusaurus/Link'
import { useColorMode } from '@docusaurus/theme-common'
import SearchBar from '@theme/SearchBar'
import { MoonIcon, SunIcon } from '@site/src/components/ThemeIcons'

export const THEME_STORAGE_KEY = 'eld-docs-theme'

const NAV_LINKS = [
  { label: 'Docs', to: '/' },
  { label: 'GitHub', href: 'https://github.com/eldnetwork' },
  { label: 'Website', href: 'https://www.eld.network' },
  { label: 'Explorer', href: 'https://explorer.eld.network', accent: true },
]

function persistTheme(isLight) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark')
  }
}

function NavLinks({ onNavigate }) {
  return NAV_LINKS.map((item) => {
    const className = [
      'eld-docs-shell__nav-link',
      item.accent ? 'eld-docs-shell__nav-link--accent' : null,
    ]
      .filter(Boolean)
      .join(' ')

    if (item.to) {
      return (
        <Link
          key={item.label}
          to={item.to}
          isNavLink
          exact={item.to === '/'}
          activeClassName="eld-docs-shell__nav-link--active"
          className={className}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      )
    }

    return (
      <a
        key={item.label}
        href={item.href}
        className={className}
        target="_blank"
        rel="noreferrer noopener"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    )
  })
}

/**
 * Custom docs chrome navbar — sole color-mode control for this site.
 * themeConfig.colorMode.disableSwitch stays true so Infima's switch is not shown.
 * themeConfig.navbar stays minimal; links and search live here.
 */
export default function Navbar() {
  const { colorMode, setColorMode } = useColorMode()
  const isLight = colorMode === 'light'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

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

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    const onResize = () => {
      if (window.matchMedia('(min-width: 901px)').matches) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  const handleThemeToggle = () => {
    const nextIsLight = !isLight
    persistTheme(nextIsLight)
    setColorMode(nextIsLight ? 'light' : 'dark')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`navbar eld-docs-shell__header${menuOpen ? ' eld-docs-shell__header--menu-open' : ''}`}
    >
      <div className="eld-docs-shell__header-bar">
        <button
          type="button"
          className="eld-docs-shell__menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="eld-docs-shell__menu-toggle-box" aria-hidden="true">
            <span className="eld-docs-shell__menu-toggle-inner" />
          </span>
        </button>

        <Link to="/" className="eld-docs-shell__brand" onClick={closeMenu}>
          <span className="eld-docs-shell__brand-mark">E</span>
          <span className="eld-docs-shell__brand-text">
            <span>ELD</span>
            <span className="eld-docs-shell__brand-muted">{'//'}</span>
            <span className="eld-docs-shell__brand-muted">DOCS</span>
          </span>
        </Link>

        <nav id={menuId} className="eld-docs-shell__nav" aria-label="Site">
          <NavLinks onNavigate={closeMenu} />
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
      </div>
    </header>
  )
}
