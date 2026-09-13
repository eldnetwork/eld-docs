import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Navbar, { DOC_NAV, THEME_STORAGE_KEY } from './index'

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

  it('exposes chrome links on desktop', () => {
    render(<Navbar />)

    const chrome = screen.getByRole('navigation', { name: 'Site' })
    expect(within(chrome).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/eldnetwork',
    )
    expect(within(chrome).getByRole('link', { name: 'Website' })).toHaveAttribute(
      'href',
      'https://www.eld.network',
    )
    expect(within(chrome).getByRole('link', { name: 'Explorer' })).toHaveAttribute(
      'href',
      'https://explorer.eld.network',
    )
  })

  it('opens docs content in the burger menu, not external sites', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)

    const docs = screen.getByRole('navigation', { name: 'Documentation' })
    expect(within(docs).getByRole('link', { name: 'Eld docs' })).toHaveAttribute('href', '/')
    expect(within(docs).getByRole('link', { name: 'Consensus' })).toHaveAttribute(
      'href',
      '/consensus',
    )
    expect(within(docs).getByRole('link', { name: 'CLI' })).toHaveAttribute('href', '/eld-cli')
    expect(within(docs).queryByRole('link', { name: 'GitHub' })).toBeNull()
    expect(within(docs).queryByRole('link', { name: 'Explorer' })).toBeNull()

    // Capacity Providers children are present
    expect(DOC_NAV.some((item) => item.label === 'Capacity Providers')).toBe(true)
    expect(within(docs).getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '/capacity-provider',
    )

    await user.click(within(docs).getByRole('link', { name: 'Eld docs' }))
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
