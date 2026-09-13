export default function Link({
  to,
  href,
  children,
  isNavLink: _isNavLink,
  exact: _exact,
  activeClassName: _activeClassName,
  ...props
}) {
  return (
    <a href={to || href} {...props}>
      {children}
    </a>
  )
}
