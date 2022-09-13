import Link from 'next/link';
import { Profile } from '../../../utils/types';

import AuthorControls from '../AuthorControls/AuthorControls';
import ReaderControls from '../ReaderControls/ReaderControls';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import Avatar from '../../Shared/Avatar/Avatar';

interface ArticleControlsProps {
  slug: string;
  author: Profile;
  isDisabled: boolean;
  isFollowing: boolean;
  isFavorited: boolean;
  favoritesCount: number;
  createdAt: string;
  onDelete: () => void;
  onFollow: () => void;
  onFavorite: () => void;
}

export default function ArticleControls({
  slug,
  author,
  isDisabled,
  isFollowing,
  isFavorited,
  favoritesCount,
  createdAt,
  onDelete,
  onFollow,
  onFavorite,
}: ArticleControlsProps): JSX.Element {
  const { user } = useAuth();
  const { push } = useRouter();

  function checkAuth() {
    if (!user) {
      push('/register');
      return;
    }
  }

  function handleFollow() {
    //TODO: move to readerControl?
    //TODO: create routes array

    checkAuth();
    onFollow();
  }

  function handleFavorite() {
    checkAuth();
    onFavorite();
  }

  function handleDelete() {
    checkAuth();
    onDelete();
  }

  const isAuthor = user?.username === author?.username;
  return (
    <div className="article-meta">
      <Link href={`/profile/${author.username}`}>
        <a style={{ verticalAlign: 'middle' }}>
          <Avatar src={author.image} alt="article author avatar" />
        </a>
      </Link>
      <div className="info">
        <Link href={`/profile/${author.username}`}>
          <a href="" className="author">
            {author.username}
          </a>
        </Link>

        <span className="date">{createdAt}</span>
      </div>
      {isAuthor ? (
        <AuthorControls
          slug={slug}
          isDisabled={isDisabled}
          onDelete={handleDelete}
        />
      ) : (
        <ReaderControls
          authorUsername={author.username}
          favoritesCount={favoritesCount}
          isDisabled={isDisabled}
          isFavorited={isFavorited}
          isFollowing={isFollowing}
          onFavorite={handleFavorite}
          onFollow={handleFollow}
        />
      )}
    </div>
  );
}
