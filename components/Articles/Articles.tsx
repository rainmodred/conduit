import ArticlePreview from './ArticlePreview/ArticlePreview';
import { Article } from '../../utils/types';

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
            updatedAt,
            tagList,
          }) => {
            return (
              <ArticlePreview
                key={slug}
                slug={slug}
                author={author}
                favorited={favorited}
                favoritesCount={favoritesCount}
                createdAt={updatedAt}
                title={title}
                description={description}
                tagList={tagList}
              />
            );
          },
        )
      )}
    </>
  );
}