import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import Articles from '../../../components/Articles/Articles';
import FeedNavigation from '../../../components/FeedNavigation';
import ProfileInfo from '../../../components/ProfileInfo/ProfileInfo';
import Pagination from '../../../components/Shared/Pagination/Pagination';
import { useAuth } from '../../../context/AuthContext';
import { getArticles } from '../../../utils/api';
import { QUERY_KEYS } from '../../../utils/queryKeys';
import { ARTICLES_LIMIT } from '../../../config/config';

export default function Favorites() {
  const { query, isReady } = useRouter();
  const { user } = useAuth();
  const page = Number(query?.page) || 1;

  const { username } = query as { username: string };

  const { data, isLoading, isIdle, isError, isSuccess } = useQuery(
    QUERY_KEYS.myArticles(username, page),
    () => getArticles(page, user?.token, { favorited: username }),
    {
      enabled: isReady,
    },
  );

  let totalPages = 0;
  if (isSuccess) {
    totalPages = Math.ceil(data?.articlesCount / ARTICLES_LIMIT);
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <ProfileInfo />
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <FeedNavigation
              routes={[
                {
                  path: `/profile/${username}`,
                  title: 'My Articles',
                  protected: false,
                },
                {
                  path: `/profile/${username}/favorites`,
                  title: 'Favorited Articles',
                  protected: false,
                },
              ]}
              className="articles-toggle"
            />
            <Articles
              articles={data?.articles}
              isError={isError}
              isLoading={isLoading || isIdle}
            />
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
