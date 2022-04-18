interface FollowButtonProps {
  children: React.ReactNode;
  followed: boolean;
  onClick: () => void;
}

export default function FollowButton({
  children,
  followed,
  onClick,
}: FollowButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`btn btn-sm ${
        followed ? 'btn-secondary' : 'btn-outline-secondary'
      }`}
    >
      <i className="ion-plus-round"></i>
      &nbsp; {followed ? 'Unfollow' : 'Follow'} {children}
    </button>
  );
}
