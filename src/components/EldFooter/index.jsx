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
      { label: 'Litepaper', to: '/litepaper' },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Docs', to: '/' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Explorer', href: 'https://explorer.eld.network' },
      { label: 'GitHub', href: 'https://github.com/eldnetwork' },
    ],
  },
  {
    heading: 'Community',
    items: [{ label: 'X', href: 'https://x.com/eld_network' }],
  },
]

export default function EldFooter() {
  return (
    <footer className="eld-docs-footer">
      <div className="eld-docs-footer__grid">
        {footerColumns.map((column) => (
          <div key={column.heading} className="eld-docs-footer__column">
            <h3>{column.heading}</h3>
            {column.items.map((item) => {
              if (item.to) {
                return (
                  <Link key={item.label} to={item.to} className="eld-docs-footer__item">
                    {item.label}
                  </Link>
                )
              }

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="eld-docs-footer__item"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <span key={item.label} className="eld-docs-footer__item">
                  {item.label}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className="eld-docs-footer__bottom">
        <span>© 2026 ELD NETWORK. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  )
}
