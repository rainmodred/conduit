import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getArticles } from '../api';
import Articles from '../components/Articles';
import FeedNavigation from '../components/FeedNavigation';
import Pagination from '../components/Pagination/Pagination';
import Tags from '../components/Tags';
import { itemsPerPage } from '../constants';
import { ArticlesFromAPi } from '../types';

interface AllProps {
  articlesData: ArticlesFromAPi;
}

export default function All({ articlesData }: AllProps): JSX.Element {
  const { isReady, query } = useRouter();

  const page = Number(query?.page) || 1;
  const { data, isLoading, isIdle, isError, isSuccess } = useQuery(
    ['articles', 'all', page],
    () => getArticles(page),
    { enabled: isReady, initialData: articlesData },
  );

  let totalPages = 0;
  if (isSuccess) {
    totalPages = Math.ceil(data?.articlesCount / itemsPerPage);
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

export const getServerSideProps: GetServerSideProps<
  AllProps
> = async context => {
  const page = parseInt(context.query.page as string) || 1;
  const articlesData = await getArticles(page);
  return { props: { articlesData } };
};