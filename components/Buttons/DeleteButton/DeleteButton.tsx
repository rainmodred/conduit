interface DeleteButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export default function DeleteButton({
  disabled,
  onClick,
}: DeleteButtonProps): JSX.Element {
  return (
    <button
      className="btn btn-outline-danger btn-sm"
      disabled={disabled}
      onClick={onClick}
    >
      <i className="ion-trash-a"></i> Delete Article
    </button>
  );
}
