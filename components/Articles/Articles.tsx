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
import { ArticleFromApi, ArticlesFromAPi } from '../../utils/types';
import { getTotalPages } from '../../utils/utils';

function createQueryKey(
  route: string,
  options: { username?: string; tag?: string; page?: number },
) {
  const { username, page, tag } = options;
  switch (route) {
    case '/':
      if (!page) {
        throw new Error('Not implemented');
      }
      return QUERY_KEYS.feed(page);
    case '/all':
      if (!page) {
        throw new Error('Not implemented');
      }
      return QUERY_KEYS.all(page);
    case '/profile/[username]':
      if (!page || !username) {
        throw new Error('Not implemented');
      }
      return QUERY_KEYS.myArticles(username, page);
    case '/profile/[username]/favorites':
      if (!page) {
        throw new Error('Not implemented');
      }
      return QUERY_KEYS.favorites(page);
    case '/tag/[tag]':
      if (!page || !tag) {
      }
      return QUERY_KEYS.tag(tag, page);
    default:
      throw new Error('Not implemented');
  }
}

interface ArticleProps {
  queryKey: readonly [string, string, number?];
  data: ArticlesFromAPi | undefined;
  isError: boolean;
}

export default function Articles({
  queryKey,
  data,
  isError,
}: ArticleProps): JSX.Element {
  const favoriteMutation = useFavoritePreviewMutation();

  if (!data) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (isError) {
    return <div className="article-preview">Something went wrong</div>;
  }

  const { articles, articlesCount } = data;
  const totalPages = getTotalPages(articlesCount);

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
                      queryKey,
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
