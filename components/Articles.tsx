import { useRouter } from 'next/router';
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
  articles: Article[];
}

export default function Articles({ articles }: ArticlesPoprs): JSX.Element {
  const { query } = useRouter();

  const tag = typeof query?.tag === 'string' ? query.tag : '';
  const filteredArticles = tag
    ? articles.filter(article => article.tagList.includes(tag))
    : [...articles];

  return (
    <>
      {filteredArticles.length === 0 ? (
        <div className="article-preview">No articles are here... yet.</div>
      ) : (
        filteredArticles.map(
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
