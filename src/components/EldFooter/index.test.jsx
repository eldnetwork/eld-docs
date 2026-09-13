import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EldFooter from './index'

describe('EldFooter', () => {
  it('links to the expected protocol and community destinations', () => {
    render(<EldFooter />)

    expect(screen.getByRole('link', { name: 'Intro' })).toHaveAttribute(
      'href',
      'https://www.eld.network',
    )
    expect(screen.getByRole('link', { name: 'Litepaper' })).toHaveAttribute('href', '/litepaper')
    expect(screen.getByRole('link', { name: 'Eld Blockchain Explorer' })).toHaveAttribute(
      'href',
      'https://explorer.eld.network',
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/eldnetwork',
    )
    expect(screen.getByRole('link', { name: 'X / Twitter' })).toHaveAttribute(
      'href',
      'https://x.com/eld_network',
    )
  })
})
