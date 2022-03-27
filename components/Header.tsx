import Link from 'next/link';
import { useRouter } from 'next/router';
import NavLink from './NavLink';

type Route = {
  title: string;
  path: string;
};

const routes: Route[] = [
  { title: 'Home', path: '/' },
  // { title: 'New Article', path: '/editor' },
  // { title: 'Settings', path: '/settings' },
  { title: 'Sign in', path: '/login' },
  { title: 'Sign up', path: '/register' },
];

export default function Header(): JSX.Element {
  const { pathname } = useRouter();
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href={routes[0].path}>
          <a className="navbar-brand">conduit</a>
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          {/* <li className="nav-item">
            <Link href={routes.home}>
              <a className="nav-link">Home</a>
            </Link>
          </li> */}
          {routes.map(({ title, path }) => {
            return (
              <li className="nav-item" key={title}>
                <NavLink isActive={pathname === path} href={path}>
                  {title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
