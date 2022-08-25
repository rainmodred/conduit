function getButtonText(favorited: boolean) {
  const str = ' Article ';

  if (favorited) {
    return 'Unfavorite' + str;
  }

  return 'Favorite' + str;
}

interface FavoriteArticleButtonProps {
  children: React.ReactNode;
  favorited: boolean;
  size: 'sm' | 'lg';
  disabled?: boolean;
  onClick: () => void;
}

export default function FavoriteArticleButton({
  children,
  favorited,
  size = 'sm',
  disabled = false,
  onClick,
}: FavoriteArticleButtonProps): JSX.Element {
  const classes = `btn btn-sm ${
    favorited ? 'btn-primary' : 'btn-outline-primary'
  } ${size === 'sm' && 'pull-xs-right'}`;

  return (
    <button onClick={onClick} className={`${classes}`} disabled={disabled}>
      <i className="ion-heart"></i>&nbsp;
      {size === 'lg' && getButtonText(favorited)}
      <span className="counter">
        {size === 'sm' ? children : `(${children})`}
      </span>
    </button>
  );
}
