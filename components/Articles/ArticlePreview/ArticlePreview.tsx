import Link from 'next/link';
import { useMutation } from 'react-query';
import { Article } from '../../../utils/types';
import Avatar from '../../Shared/Avatar/Avatar';
import FavoriteArticleButton from '../../Shared/Buttons/FavoriteButton/FavoriteButton';

type ArticlePreviewProps = Omit<Article, 'updatedAt' | 'body'>;

export default function ArticlePreview({
  slug,
  title,
  description,
  createdAt,
  author,
  favorited,
  favoritesCount,
  tagList,
}: ArticlePreviewProps): JSX.Element {
  const { image, username } = author;
  const mutation = useMutation();

  function handleFavoriteClick() {
    // TODO
  }

  return (
    <div className="article-preview">
      <div className="article-meta">
        <a href={`/profile/${username}`}>
          <Avatar src={image} alt="author avatar" />
        </a>
        <div className="info">
          <a href="" className="author">
            {username}
          </a>
          <span className="date">{createdAt}</span>
        </div>
        <FavoriteArticleButton
          favorited={favorited}
          size="sm"
          onClick={handleFavoriteClick}
        >
          {favoritesCount}
        </FavoriteArticleButton>
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
