import { useEffect, useId, useState } from 'react'
import Link from '@docusaurus/Link'
import { useColorMode } from '@docusaurus/theme-common'
import SearchBar from '@theme/SearchBar'
import { MoonIcon, SunIcon } from '@site/src/components/ThemeIcons'

export const THEME_STORAGE_KEY = 'eld-docs-theme'

/** External chrome — desktop header only */
const CHROME_LINKS = [
  { label: 'GitHub', href: 'https://github.com/eldnetwork' },
  { label: 'Website', href: 'https://www.eld.network' },
  { label: 'Explorer', href: 'https://explorer.eld.network', accent: true },
]

/**
 * Docs content — mirrors sidebars.js labels (what the burger opens on mobile).
 * Keep in sync with `sidebars.js`.
 */
export const DOC_NAV = [
  { label: 'Welcome to Eld Docs', to: '/' },
  {
    label: 'Eld Litepaper: The Eld Ephemeral Data Storage Protocol',
    to: '/litepaper',
  },
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Consensus', to: '/consensus' },
  { label: 'Accounts', to: '/accounts-overview' },
  { label: 'Transactions', to: '/transactions-overview' },
  {
    label: 'Capacity Providers',
    items: [
      { label: 'Overview', to: '/capacity-provider' },
      {
        label: 'P2P protocol for capacity providers',
        to: '/capacity-provider-p2p-protocol',
      },
    ],
  },
  { label: 'Custom namespaces', to: '/namespaces' },
  { label: 'Content addresses', to: '/content-addresses' },
  { label: 'CLI', to: '/eld-cli' },
]

function persistTheme(isLight) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark')
  }
}

function ChromeLinks() {
  return CHROME_LINKS.map((item) => (
    <a
      key={item.label}
      href={item.href}
      className={[
        'eld-docs-shell__nav-link',
        item.accent ? 'eld-docs-shell__nav-link--accent' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      target="_blank"
      rel="noreferrer noopener"
    >
      {item.label}
    </a>
  ))
}

function DocsContentNav({ onNavigate }) {
  return (
    <ul className="eld-docs-shell__docs-menu">
      {DOC_NAV.map((item) => {
        if (item.items) {
          return (
            <li key={item.label} className="eld-docs-shell__docs-menu-category">
              <div className="eld-docs-shell__docs-menu-category-label">{item.label}</div>
              <ul className="eld-docs-shell__docs-menu">
                {item.items.map((child) => (
                  <li key={child.to}>
                    <Link
                      to={child.to}
                      isNavLink
                      activeClassName="eld-docs-shell__docs-menu-link--active"
                      className="eld-docs-shell__docs-menu-link"
                      onClick={onNavigate}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )
        }

        return (
          <li key={item.to}>
            <Link
              to={item.to}
              isNavLink
              exact={item.to === '/'}
              activeClassName="eld-docs-shell__docs-menu-link--active"
              className="eld-docs-shell__docs-menu-link"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Custom docs chrome navbar — sole color-mode control for this site.
 * themeConfig.colorMode.disableSwitch stays true so Infima's switch is not shown.
 * Desktop: external chrome links. Mobile burger: docs content (sidebar IA).
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

        <nav className="eld-docs-shell__nav eld-docs-shell__nav--chrome" aria-label="Site">
          <ChromeLinks />
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

      <nav id={menuId} className="eld-docs-shell__docs-panel" aria-label="Documentation">
        <DocsContentNav onNavigate={closeMenu} />
      </nav>
    </header>
  )
}
