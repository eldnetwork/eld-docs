/**
 * JSON-LD helpers for docs SEO — Organization matches www.eld.network.
 */

export const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Eld',
  url: 'https://www.eld.network',
  logo: 'https://www.eld.network/eld-logo-150.png',
  sameAs: ['https://x.com/eld_network', 'https://github.com/eldnetwork'],
  description:
    'Eld is a decentralized protocol for ephemeral, content-addressed storage. Set a TTL, verify data while it is live, and let it expire.',
};

/** Paths that should use TechArticle (long-form protocol narrative). */
export const TECH_ARTICLE_PATHS = new Set([
  '/litepaper',
  '/consensus',
  '/content-addresses',
  '/capacity-provider',
  '/capacity-provider-p2p-protocol',
  '/namespaces',
]);

/**
 * @param {{ siteUrl: string, permalink: string, title: string, description?: string }} opts
 */
export function buildWebSiteJsonLd({ siteUrl, permalink, title, description }) {
  const isHome = permalink === '/' || permalink === '';
  /** @type {Record<string, unknown>} */
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Eld Docs',
    url: siteUrl,
    description:
      description ||
      'Official documentation for Eld — ephemeral, content-addressed decentralized storage.',
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'Eld',
      url: 'https://www.eld.network',
    },
  };

  if (isHome) {
    data.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  // Keep title available for consumers that inspect this object (not in schema).
  void title;
  return data;
}

/**
 * @param {{ siteUrl: string, permalink: string, title: string, description?: string, dateModified?: string }} opts
 */
export function buildTechArticleJsonLd({ siteUrl, permalink, title, description, dateModified }) {
  /** @type {Record<string, unknown>} */
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    name: title,
    description,
    url: `${siteUrl}${permalink === '/' ? '' : permalink}`,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'Eld',
      url: 'https://www.eld.network',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eld',
      url: 'https://www.eld.network',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.eld.network/eld-logo-150.png',
      },
    },
  };
  if (dateModified) {
    data.dateModified = dateModified;
  }
  return data;
}

/**
 * @param {{ siteUrl: string, permalink: string, title: string, breadcrumbs?: { name: string, path: string }[] }} opts
 */
export function buildBreadcrumbJsonLd({ siteUrl, permalink, title, breadcrumbs }) {
  const items =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [
          { name: 'Docs', path: '/' },
          { name: title, path: permalink },
        ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  };
}
