interface FollowButtonProps {
  children: React.ReactNode;
  followed: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function FollowButton({
  children,
  followed,
  disabled = false,
  onClick,
}: FollowButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`btn btn-sm ${
        followed ? 'btn-secondary' : 'btn-outline-secondary'
      }`}
      disabled={disabled}
    >
      <i className="ion-plus-round"></i>
      &nbsp; {followed ? 'Unfollow' : 'Follow'} {children}
    </button>
  );
}
