import ArticlePreview from './ArticlePreview/ArticlePreview';
import FavoriteArticleButton from '../Shared/Buttons/FavoriteButton/FavoriteButton';
import Pagination from '../Shared/Pagination/Pagination';
import useFavoritePreviewMutation from '../../hooks/useFavoritePreviewMutation';
import { getTotalPages } from '../../utils/utils';
import { ArticlesFromAPi } from '../../utils/types';

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
