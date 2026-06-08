// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder
  docs: [
    'intro',  // This makes the intro page appear first (shorthand for {type: 'doc', id: 'intro'})
    'roadmap',

    {
      type: 'category',
      label: 'Eld consensus protocol',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'consensus', label: 'Consensus' },
      ],
      link: {
        type: 'doc',
        id: 'consensus',
      },
    },

    {
      type: 'category',
      label: 'Accounts',  // Section name in sidebar
      collapsible: true,  // Allow collapsing (optional, default true)
      collapsed: false,   // Start expanded (optional)
      items: [
        'accounts-overview',  // Add your placeholder or other account-related docs here
        // Add more later, e.g.: 'accounts/create', 'accounts/manage'
      ],
      // Optional: Add a landing page for the section
      link: {
        type: 'doc',
        id: 'accounts-overview',  // Makes "Accounts" clickable, linking to the overview page
      },
    },

    {
      type: 'category',
      label: 'Transactions',
      collapsible: true,
      collapsed: false,
      items: [
        'transactions-overview',
        // Add more later, e.g.: 'transactions/list', 'transactions/details'
      ],
      link: {
        type: 'doc',
        id: 'transactions-overview',
      },
    },

    {
      type: 'category',
      label: 'Capacity Providers',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'capacity-provider', label: 'Capacity Provider Overview' },
        'capacity-provider-p2p-protocol',
      ],
      link: {
        type: 'doc',
        id: 'capacity-provider',
      },
    },

    {
      type: 'category',
      label: 'Custom namespaces',
      collapsible: true,
      collapsed: false,
      items: [
        'namespaces',
      ],
      link: {
        type: 'doc',
        id: 'namespaces',
      },
    },

    {
      type: 'category',
      label: 'Content addresses',
      collapsible: true,
      collapsed: false,
      items: [
        'content-addresses',
      ],
      link: {
        type: 'doc',
        id: 'content-addresses',
      },
    },

    {
      type: 'category',
      label: 'CLI',
      collapsible: true,
      collapsed: false,
      items: [
        'eld-cli',
      ],
      link: {
        type: 'doc',
        id: 'eld-cli',
      },
    },
  ],
};

export default sidebars;
