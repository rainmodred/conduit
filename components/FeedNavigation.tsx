import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function FeedNavigation(): JSX.Element {
  const { asPath, query } = useRouter();
  const { tag } = query;
  const { user } = useAuth();

  const activeTab = asPath.startsWith('/all')
    ? 'all'
    : asPath.startsWith('/tag')
    ? 'tag'
    : 'feed';

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {user && (
          <li className="nav-item">
            <Link href="/">
              <a
                className={`nav-link ${activeTab === 'feed' ? 'active' : ''} `}
              >
                Your Feed
              </a>
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link href="/all">
            <a className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}>
              Global Feed
            </a>
          </Link>
        </li>
        {tag && (
          <li className="nav-item">
            <Link href={`/tag/${tag}`}>
              <a className={`nav-link ${activeTab === 'tag' ? 'active' : ''}`}>
                # {tag}
              </a>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
