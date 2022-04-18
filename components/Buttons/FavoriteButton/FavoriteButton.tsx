interface FavotriteArticleButtonProps {
  children: React.ReactNode;
  favorited: boolean;
  size: 'sm' | 'lg';
  onClick: () => void;
}

function getButtonText(favorited: boolean) {
  const str = ' Article ';

  if (favorited) {
    return 'Unfavorite' + str;
  }

  return 'Favorite' + str;
}

export default function FavotriteArticleButton({
  children,
  favorited,
  size = 'sm',
  onClick,
}: FavotriteArticleButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`btn btn-sm ${
        favorited ? 'btn-primary' : 'btn-outline-primary'
      }`}
    >
      <i className="ion-heart"></i>&nbsp;
      {size === 'lg' && getButtonText(favorited)}
      <span className="counter">
        {size === 'sm' ? children : `(${children})`}
      </span>
    </button>
  );
}
