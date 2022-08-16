import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getFeed } from '../utils/api';
import Articles from '../components/Articles/Articles';
import FeedNavigation from '../components/FeedNavigation';
import Pagination from '../components/Shared/Pagination/Pagination';
import Tags from '../components/Tags/Tags';
import { useAuth } from '../context/AuthContext';
import { ARTICLES_LIMIT } from '../config/config';

export default function Home() {
  const { user } = useAuth();
  const { isReady, push, query } = useRouter();

  const page = Number(query?.page) || 1;

  const { data, isLoading, isIdle, isError, isSuccess } = useQuery(
    ['articles', 'feed', page],
    () => getFeed(page, user?.token as string),
    { enabled: isReady && Boolean(user) },
  );

  let totalPages = 0;
  if (isSuccess) {
    totalPages = Math.ceil(data?.articlesCount / ARTICLES_LIMIT);
  }

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
            <FeedNavigation />
            <Articles
              articles={data?.articles}
              isError={isError}
              isLoading={isLoading || isIdle}
            />
            <Pagination totalPages={totalPages} />
          </div>
          <div className="col-md-3">
            <Tags />
          </div>
        </div>
      </div>
    </div>
  );
}
