import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function FeedNavigation(): JSX.Element {
  const { asPath, isReady, query } = useRouter();
  const { tag } = query;
  const { user } = useAuth();

  return (
    <div className="feed-toggle">
      {isReady && (
        <ul className="nav nav-pills outline-active">
          {user && (
            <li className="nav-item">
              <Link href={`?feed=${user.username}`}>
                <a
                  className={`nav-link ${
                    asPath === `/?feed=${user.username}` ? 'active' : ''
                  } `}
                >
                  Your Feed
                </a>
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link href="/">
              <a className={`nav-link ${asPath === '/' ? 'active' : ''}`}>
                Global Feed
              </a>
            </Link>
          </li>
          {tag && (
            <li className="nav-item">
              <Link href={`?tag=${tag}`}>
                <a className="nav-link active"># {tag}</a>
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
