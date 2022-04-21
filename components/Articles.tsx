import ArticlePreview from './ArticlePreview';
import { Article } from '../types';

function formatDate(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-US', options);
}

interface ArticlesPoprs {
  articles: Article[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function Articles({
  articles,
  isLoading,
  isError,
}: ArticlesPoprs): JSX.Element {
  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (isError) {
    return <div className="article-preview">TODO...</div>;
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
                createdAt={formatDate(updatedAt)}
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
