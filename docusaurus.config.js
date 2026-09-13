// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const DEFAULT_DESCRIPTION =
  'Eld docs — ephemeral, content-addressed decentralized storage with TTL, namespaces, and capacity providers.'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Eld Docs',
  tagline: 'Ephemeral, content-addressed decentralized storage',
  favicon: 'img/favicon.ico',

  // Canonical URLs without trailing slash (avoid / vs no-slash sitemap duplicates).
  // Confirm the CDN/host 301s https://docs.eld.network/ → https://docs.eld.network when trailingSlash is false.
  trailingSlash: false,

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'Eld Network',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'Eld Docs',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/img/favicon.svg',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/favicon-16x16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      // Matches www.eld.network Organization (sameAs + logo).
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Eld',
        url: 'https://www.eld.network',
        logo: 'https://www.eld.network/eld-logo-150.png',
        sameAs: ['https://x.com/eld_network', 'https://github.com/eldnetwork'],
        description:
          'Eld is a decentralized protocol for ephemeral, content-addressed storage. Set a TTL, verify data while it is live, and let it expire.',
      }),
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.eld.network',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'eldnetwork', // Usually your GitHub org/user name.
  projectName: 'eld-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/eldnetwork/eld-docs/edit/main/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/search/**', '/tags/**'],
        },
      }),
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/og-1200x630.png',
      metadata: [
        { name: 'description', content: DEFAULT_DESCRIPTION },
        { name: 'robots', content: 'index, follow' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@eld_network' },
        { name: 'twitter:image', content: 'https://docs.eld.network/img/og-1200x630.png' },
        {
          name: 'twitter:image:alt',
          content: 'Eld — ephemeral decentralized storage documentation',
        },
      ],
      // Official ColorModeToggle is disabled on purpose: the swizzled Navbar
      // (`src/theme/Navbar`) is the only theme control (custom ThemeIcons +
      // localStorage key `eld-docs-theme`). Do not set disableSwitch: false
      // unless that custom toggle is removed.
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // Nav items and search are rendered by the swizzled Navbar, not Infima.
      navbar: {
        hideOnScroll: false,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
}

export default config
