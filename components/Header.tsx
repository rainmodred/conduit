import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import NavLink from './NavLink';

type Route = {
  title: string;
  path: string;
};

const publicRoutes: Route[] = [
  { title: 'Sign in', path: '/login' },
  { title: 'Sign up', path: '/register' },
];

const protectedRoutes: Route[] = [
  { title: 'New Article', path: '/editor' },
  { title: 'Settings', path: '/settings' },
];

export default function Header(): JSX.Element {
  const { pathname } = useRouter();
  const [user] = useAuth();

  function renderRoutes() {
    const profilePath = `/${user?.username}`;

    if (user) {
      return (
        <>
          {protectedRoutes.map(({ title, path }) => (
            <li className="nav-item" key={title}>
              <NavLink isActive={pathname === path} href={path}>
                {title}
              </NavLink>
            </li>
          ))}
          <li className="nav-item">
            <NavLink isActive={pathname === profilePath} href={profilePath}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Image
                  className="user-pic"
                  src={user.image}
                  alt="profile avatar"
                  height="26"
                  width="26"
                />

                {user.username}
              </div>
            </NavLink>
          </li>
        </>
      );
    }

    return (
      <>
        {publicRoutes.map(({ title, path }) => (
          <li className="nav-item" key={title}>
            <NavLink isActive={pathname === path} href={path}>
              {title}
            </NavLink>
          </li>
        ))}
      </>
    );
  }

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">conduit</a>
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink isActive={pathname === '/'} href={'/'}>
              Home
            </NavLink>
          </li>
          {renderRoutes()}
        </ul>
      </div>
    </nav>
  );
}
