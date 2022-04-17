import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getArticles, getFeed } from '../api';
import Articles from '../components/Articles';
import FeedNavigation from '../components/FeedNavigation';
import Pagination from '../components/Pagination/Pagination';
import Tags from '../components/Tags';
import { itemsPerPage } from '../constants';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const { isReady, push, query } = useRouter();

  const page = Number(query?.page) || 1;

  const { data, isLoading, isIdle, isError, isSuccess } = useQuery(
    ['articles', 'feed', page],
    () => getArticles(page, user?.token as string),
    { enabled: isReady && Boolean(user) },
  );

  let totalPages = 0;
  if (isSuccess) {
    totalPages = Math.ceil(data?.articlesCount / itemsPerPage);
  }

  useEffect(() => {
    if (isReady && user === null) {
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
