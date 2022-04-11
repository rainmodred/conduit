import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FeedNavigation(): JSX.Element {
  const { asPath, query } = useRouter();
  const { tag } = query;
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'feed' | 'global' | 'tag'>(
    'global',
  );

  useEffect(() => {
    if (user && query.feed === user?.username) {
      setActiveTab('feed');
      return;
    }

    if (query?.tag) {
      setActiveTab('tag');
      return;
    }

    setActiveTab('global');
  }, [asPath, query, user]);

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {user && (
          <li className="nav-item">
            <Link href={`?feed=${user.username}`}>
              <a
                className={`nav-link ${activeTab === 'feed' ? 'active' : ''} `}
              >
                Your Feed
              </a>
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link href="/">
            <a className={`nav-link ${activeTab === 'global' ? 'active' : ''}`}>
              Global Feed
            </a>
          </Link>
        </li>
        {tag && (
          <li className="nav-item">
            <Link href={`?tag=${tag}`}>
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
