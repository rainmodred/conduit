import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

interface FeedRoute {
  path: string;
  title: string;
  protected?: boolean;
}
interface FeedNavigationProps {
  routes: FeedRoute[];
  className: string;
}

interface TabProps {
  route: FeedRoute;
  isActive: boolean;
}

function Tab({ route, isActive }: TabProps) {
  return (
    <li className="nav-item">
      <Link href={route.path}>
        <a className={`nav-link ${isActive ? 'active' : ''} `}>{route.title}</a>
      </Link>
    </li>
  );
}

export default function FeedNavigation({
  routes,
  className,
}: FeedNavigationProps): JSX.Element {
  const { asPath, query } = useRouter();
  const { tag } = query;
  const { user } = useAuth();

  return (
    <div className={className}>
      <ul className="nav nav-pills outline-active">
        {routes.map(route => {
          if (route.protected) {
            return (
              user && (
                <Tab
                  key={route.path}
                  route={route}
                  isActive={route.path === asPath}
                />
              )
            );
          }
          return (
            <Tab
              key={route.path}
              route={route}
              isActive={route.path === asPath}
            />
          );
        })}
        {tag && (
          <Tab
            route={{ path: `/tag/${tag}`, title: `# ${tag}` }}
            isActive={asPath.startsWith('/tag')}
          />
        )}
      </ul>
    </div>
  );
}
