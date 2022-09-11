import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import ArticlePreview from './ArticlePreview/ArticlePreview';
import FavoriteArticleButton from '../Shared/Buttons/FavoriteButton/FavoriteButton';
import Pagination from '../Shared/Pagination/Pagination';
import useFavoritePreviewMutation from '../../hooks/useFavoritePreviewMutation';
import { useAuth } from '../../context/AuthContext';
import { getArticles, getFeed } from '../../utils/api';
import { QUERY_KEYS } from '../../utils/queryKeys';
import { ARTICLES_LIMIT } from '../../config/config';

function createQueryKey(route: string, username: string, page: number) {
  switch (route) {
    case '/':
      return QUERY_KEYS.feed(page);
    case '/all':
      return QUERY_KEYS.all(page);
    case '/profile/[username]':
      return QUERY_KEYS.myArticles(username, page);
    case '/profile/[username]/favorites':
      return QUERY_KEYS.favorites(page);
    default:
      throw new Error('Not implemented');
  }
}

interface ArticleProps {
  isFeed?: boolean;
  author?: string;
  favorited?: string;
}

export default function Articles({
  isFeed = false,
  author,
  favorited,
}: ArticleProps): JSX.Element {
  const { route, isReady, query } = useRouter();
  const { user } = useAuth();

  const page = Number(query?.page) || 1;
  const { username } = query as { username: string };
  const favoriteMutation = useFavoritePreviewMutation();
  const { data, isLoading, isIdle, isError, isSuccess } = useQuery(
    createQueryKey(route, username, page),
    () =>
      isFeed
        ? getFeed(page, user?.token)
        : getArticles(page, user?.token, { author, favorited }),
    {
      enabled:
        isReady && Boolean(username) && Boolean(user || user === undefined),
    },
  );

  if (isLoading || isIdle) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (isError) {
    return <div className="article-preview">Something went wrong</div>;
  }

  const { articles, articlesCount } = data;
  let totalPages = 0;
  if (isSuccess) {
    totalPages = Math.ceil(articlesCount / ARTICLES_LIMIT);
  }

  return (
    <>
      {articles?.length === 0 ? (
        <div className="article-preview">No articles are here... yet.</div>
      ) : (
        articles?.map(
          ({
            slug,
            author,
            favorited,
            favoritesCount,
            title,
            description,
            tagList,
            createdAt,
          }) => {
            return (
              <ArticlePreview
                article={{
                  slug,
                  author,
                  title,
                  description,
                  tagList,
                  createdAt,
                }}
                key={slug}
              >
                <FavoriteArticleButton
                  favorited={favorited}
                  size="sm"
                  onClick={() =>
                    favoriteMutation.mutate({
                      queryKey: createQueryKey(route, username, page),
                      favorited,
                      slug,
                    })
                  }
                >
                  {favoritesCount}
                </FavoriteArticleButton>
              </ArticlePreview>
            );
          },
        )
      )}

      <Pagination totalPages={totalPages} />
    </>
  );
}
