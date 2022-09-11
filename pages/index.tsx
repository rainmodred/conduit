import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Articles from '../components/Articles/Articles';
import FeedNavigation from '../components/FeedNavigation';
import Tags from '../components/Tags/Tags';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const { isReady, push } = useRouter();

  useEffect(() => {
    if (isReady && user === undefined) {
      push({ pathname: '/all' });
    }

    // infinite rerender with push
  }, [user, isReady]);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedNavigation
              routes={[
                { path: '/', title: 'Your Feed', protected: true },
                { path: '/all', title: 'Global Feed', protected: false },
              ]}
              className="feed-toggle"
            />
            <Articles isFeed={true} />
          </div>

          <div className="col-md-3">
            <Tags />
          </div>
        </div>
      </div>
    </div>
  );
}
