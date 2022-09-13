import Head from 'next/head';
import { useRouter } from 'next/router';

import Articles from '../../components/Articles/Articles';
import FeedNavigation from '../../components/FeedNavigation/FeedNavigation';
import Tags from '../../components/Tags/Tags';
import useArticles from '../../hooks/useArticles';

export default function Tag(): JSX.Element {
  const { query } = useRouter();
  const { tag } = query as { tag: string };
  const { queryKey, data, isError } = useArticles({ tag });

  return (
    <>
      <Head>
        <title>#{tag}</title>
      </Head>
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

              <Articles queryKey={queryKey} data={data} isError={isError} />
            </div>
            <div className="col-md-3">
              <Tags />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async context => {
//   const page = parseInt(context.query.page as string) || 1;
//   const tag = context.query?.tag as string;
//   const queryClient = new QueryClient();
//
//   await queryClient.prefetchQuery(QUERY_KEYS.tag(tag, page), () =>
//     getArticles(page, undefined, { tag: context.query?.tag }),
//   );
//
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };
