import { useEffect, useState } from 'react';
import ArticlePreview from './ArticlePreview';
import { apiUrl } from '../api';
import { Article } from '../types';

function formatDate(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-US', options);
}

export default function Articles(): JSX.Element {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/articles`)
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>loading...</p>;
  }

  console.log('artciles', articles);

  return (
    <>
      {articles.map(
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
      )}
    </>
  );
}
