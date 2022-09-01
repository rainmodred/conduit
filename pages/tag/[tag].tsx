import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';

import Articles from '../../components/Articles/Articles';
import FeedNavigation from '../../components/FeedNavigation';
import Pagination from '../../components/Shared/Pagination/Pagination';
import Tags from '../../components/Tags/Tags';
import { getArticles } from '../../utils/api';
import { ARTICLES_LIMIT } from '../../config/config';

// TODO: Add Main component
export default function Tag(): JSX.Element {
  const { isReady, query } = useRouter();

  const page = Number(query?.page) || 1;
  const { data, isLoading, isIdle, isError, isSuccess } = useQuery(
    ['articles', `${query?.tag}`, page],
    () => getArticles(page, undefined, { tag: query?.tag as string }),
    { enabled: isReady && Boolean(query?.tag) },
  );

  let totalPages = 0;
  if (isSuccess) {
    totalPages = Math.ceil(data?.articlesCount / ARTICLES_LIMIT);
  }
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

export const getServerSideProps: GetServerSideProps = async context => {
  const page = parseInt(context.query.page as string) || 1;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['articles', 'tag', page], () =>
    getArticles(page, undefined, { tag: context.query?.tag }),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
