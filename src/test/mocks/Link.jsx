export default function Link({ to, href, children, ...props }) {
  return (
    <a href={to || href} {...props}>
      {children}
    </a>
  )
}
