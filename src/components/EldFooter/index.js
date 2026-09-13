import React from 'react'
import Link from '@docusaurus/Link'

const footerColumns = [
  {
    heading: 'ELD',
    items: [
      { label: 'a decentralized blockchain protocol.' },
      { label: '/eld/ - old nordic word for fire.' },
    ],
  },
  {
    heading: 'Protocol',
    items: [
      { label: 'Intro', href: 'https://eld.network' },
      { label: 'Litepaper', to: '/litepaper' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Eld Blockchain Explorer', href: 'https://explorer.eld.network' },
      { label: 'GitHub', href: 'https://github.com/eldnetwork' },
    ],
  },
  {
    heading: 'Community',
    items: [{ label: 'X / Twitter', href: 'https://x.com/eld_network' }],
  },
]

export default function EldFooter() {
  return (
    <footer className="explorer-footer">
      <div className="explorer-footer__grid">
        {footerColumns.map((column) => (
          <div key={column.heading} className="explorer-footer__column">
            <h3>{column.heading}</h3>
            {column.items.map((item) => {
              if (item.to) {
                return (
                  <Link key={item.label} to={item.to} className="explorer-footer__item">
                    {item.label}
                  </Link>
                )
              }

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="explorer-footer__item"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <span key={item.label} className="explorer-footer__item">
                  {item.label}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className="explorer-footer__bottom">
        <span>© 2026 ELD NETWORK. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  )
}
