import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Navbar, { THEME_STORAGE_KEY } from './index'

describe('Navbar', () => {
  it('persists theme choice to localStorage and toggles color mode', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const toggle = screen.getByRole('button', { name: /switch to light mode/i })
    await user.click(toggle)

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }))
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('exposes docs, GitHub, website, and explorer links', () => {
    render(<Navbar />)

    const nav = screen.getByRole('navigation', { name: 'Site' })
    expect(within(nav).getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/')
    expect(within(nav).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/eldnetwork',
    )
    expect(within(nav).getByRole('link', { name: 'Website' })).toHaveAttribute(
      'href',
      'https://www.eld.network',
    )
    expect(within(nav).getByRole('link', { name: 'Explorer' })).toHaveAttribute(
      'href',
      'https://explorer.eld.network',
    )
  })

  it('toggles a compact mobile menu', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(document.querySelector('.eld-docs-shell__header')).not.toHaveClass(
      'eld-docs-shell__header--menu-open',
    )

    await user.click(menuButton)
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(document.querySelector('.eld-docs-shell__header')).toHaveClass(
      'eld-docs-shell__header--menu-open',
    )

    await user.click(screen.getByRole('link', { name: 'Docs' }))
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
