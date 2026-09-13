import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EldFooter from './index'

describe('EldFooter', () => {
  it('aligns protocol and community links with the marketing site', () => {
    render(<EldFooter />)

    expect(screen.getByRole('link', { name: 'Litepaper' })).toHaveAttribute('href', '/litepaper')
    expect(screen.getByRole('link', { name: 'Roadmap' })).toHaveAttribute('href', '/roadmap')
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Explorer' })).toHaveAttribute(
      'href',
      'https://explorer.eld.network',
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/eldnetwork',
    )
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute(
      'href',
      'https://x.com/eld_network',
    )
    expect(screen.queryByRole('link', { name: 'Intro' })).toBeNull()
  })
})
