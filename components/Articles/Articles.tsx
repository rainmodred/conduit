import { useRouter } from 'next/router';

import ArticlePreview from './ArticlePreview/ArticlePreview';
import FavoriteArticleButton from '../Shared/Buttons/FavoriteButton/FavoriteButton';
import useFavoritePreviewMutation from '../../hooks/useFavoritePreviewMutation';
import { Article } from '../../utils/types';
import { QUERY_KEYS } from '../../utils/queryKeys';

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
  articles: Article[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function Articles({
  articles,
  isLoading,
  isError,
}: ArticleProps): JSX.Element {
  const { route, query } = useRouter();

  const page = Number(query?.page) || 1;
  const { username } = query as { username: string };
  const favoriteMutation = useFavoritePreviewMutation();

  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (isError) {
    return <div className="article-preview">Something went wrong</div>;
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
    </>
  );
}
