import { describe, expect, it } from 'vitest'
import {
  ORGANIZATION,
  TECH_ARTICLE_PATHS,
  buildBreadcrumbJsonLd,
  buildTechArticleJsonLd,
  buildWebSiteJsonLd,
} from './seoJsonLd'

describe('seoJsonLd', () => {
  it('matches marketing Organization sameAs and logo', () => {
    expect(ORGANIZATION.url).toBe('https://www.eld.network')
    expect(ORGANIZATION.logo).toBe('https://www.eld.network/eld-logo-150.png')
    expect(ORGANIZATION.sameAs).toContain('https://x.com/eld_network')
    expect(ORGANIZATION.sameAs).toContain('https://github.com/eldnetwork')
  })

  it('adds SearchAction only for the homepage WebSite graph', () => {
    const home = buildWebSiteJsonLd({
      siteUrl: 'https://docs.eld.network',
      permalink: '/',
      title: 'Home',
    })
    expect(home.potentialAction).toBeTruthy()

    const other = buildWebSiteJsonLd({
      siteUrl: 'https://docs.eld.network',
      permalink: '/litepaper',
      title: 'Litepaper',
    })
    expect(other.potentialAction).toBeUndefined()
  })

  it('builds TechArticle and breadcrumbs for protocol pages', () => {
    expect(TECH_ARTICLE_PATHS.has('/litepaper')).toBe(true)
    const article = buildTechArticleJsonLd({
      siteUrl: 'https://docs.eld.network',
      permalink: '/litepaper',
      title: 'Litepaper',
      description: 'Protocol narrative',
    })
    expect(article['@type']).toBe('TechArticle')
    expect(article.url).toBe('https://docs.eld.network/litepaper')

    const crumbs = buildBreadcrumbJsonLd({
      siteUrl: 'https://docs.eld.network',
      permalink: '/litepaper',
      title: 'Litepaper',
      breadcrumbs: [
        { name: 'Docs', path: '/' },
        { name: 'Litepaper', path: '/litepaper' },
      ],
    })
    expect(crumbs.itemListElement).toHaveLength(2)
  })
})
