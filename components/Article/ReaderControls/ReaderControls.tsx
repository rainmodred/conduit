import FavoriteArticleButton from '../../Shared/Buttons/FavoriteButton/FavoriteButton';
import FollowButton from '../../Shared/Buttons/FollowButton/FollowButton';

interface ReaderControlsProps {
  authorUsername: string;
  favoritesCount: number;
  isDisabled: boolean;
  isFollowing: boolean;
  isFavorited: boolean;
  onFollow: () => void;
  onFavorite: () => void;
}

export default function ReaderControls({
  authorUsername,
  favoritesCount,
  isDisabled,
  isFollowing,
  isFavorited,
  onFollow,
  onFavorite,
}: ReaderControlsProps): JSX.Element {
  return (
    <span>
      <FollowButton
        followed={isFollowing}
        onClick={onFollow}
        disabled={isDisabled}
      >
        {authorUsername}
      </FollowButton>
      &nbsp;&nbsp;
      <FavoriteArticleButton
        favorited={isFavorited}
        size="lg"
        disabled={isDisabled}
        onClick={onFavorite}
      >
        {favoritesCount}
      </FavoriteArticleButton>
    </span>
  );
}
