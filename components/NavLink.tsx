import Link from 'next/link';

interface NavLinkProps {
  children: React.ReactNode;
  isActive: boolean;
  href: string;
}

export default function NavLink({
  children,
  isActive,
  href,
}: NavLinkProps): JSX.Element {
  const classes = `nav-link ${isActive ? 'active' : ''}`.trim();

  return (
    <Link href={href}>
      <a className={classes}>{children}</a>
    </Link>
  );
}
