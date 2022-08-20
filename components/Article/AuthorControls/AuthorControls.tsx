import DeleteButton from '../../Shared/Buttons/DeleteButton/DeleteButton';
import EditButton from '../../Shared/Buttons/EditButton/EditButton';

interface AuthorControlsProps {
  slug: string;
  isDisabled: boolean;
  onDelete: () => void;
}
// TODO: add lazy loading
export default function AuthorControls({
  slug,
  isDisabled,
  onDelete,
}: AuthorControlsProps): JSX.Element {
  return (
    <span>
      <EditButton slug={slug} type="article" />
      &nbsp;&nbsp;
      <DeleteButton onClick={onDelete} disabled={isDisabled} />
    </span>
  );
}
