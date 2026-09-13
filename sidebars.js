// @ts-check

/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    'intro',
    'quickstart',
    'litepaper',
    'faq',
    'roadmap',
    { type: 'doc', id: 'consensus', label: 'Consensus' },
    { type: 'doc', id: 'accounts-overview', label: 'Accounts' },
    { type: 'doc', id: 'transactions-overview', label: 'Transactions' },
    {
      type: 'category',
      label: 'Capacity Providers',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'capacity-provider', label: 'Overview' },
        'capacity-provider-p2p-protocol',
      ],
      link: {
        type: 'doc',
        id: 'capacity-provider',
      },
    },
    { type: 'doc', id: 'namespaces', label: 'Custom namespaces' },
    { type: 'doc', id: 'content-addresses', label: 'Content addresses' },
    { type: 'doc', id: 'eld-cli', label: 'CLI' },
  ],
}

export default sidebars
