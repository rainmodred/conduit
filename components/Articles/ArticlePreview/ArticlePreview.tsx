import Link from 'next/link';

import Avatar from '../../Shared/Avatar/Avatar';
import { Article } from '../../../utils/types';

interface ArticlePreviewProps {
  article: Omit<Article, 'updatedAt' | 'body' | 'favorited' | 'favoritesCount'>;
  children: React.ReactNode;
}

export default function ArticlePreview({
  article,
  children,
}: ArticlePreviewProps): JSX.Element {
  const { slug, title, description, createdAt, author, tagList } = article;
  const { image, username } = author;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link href={`/profile/${username}`}>
          <a>
            <Avatar src={image} alt="author avatar" />
          </a>
        </Link>
        <div className="info">
          <Link href={`/profile/${username}`}>
            <a className="author">{username}</a>
          </Link>
          <span className="date">{createdAt}</span>
        </div>
        {children}
      </div>

      <Link href={`/article/${slug}`}>
        <a className="preview-link">
          <h1>{title}</h1>
          <p>{description}</p>
          <span>Read more...</span>

          {tagList.length > 0 && (
            <ul className="tag-list">
              {tagList.map((tag, index) => (
                <li
                  key={`article-tag-${index}`}
                  className="tag-default tag-pill tag-outline"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </a>
      </Link>
    </div>
  );
}
