import Link from 'next/link';

interface EditArticleProps {
  type: 'article';
  slug: string;
}

interface EditProfileProps {
  type: 'profile';
}

export default function EditButton(
  props: EditArticleProps | EditProfileProps,
): JSX.Element {
  if (props.type === 'profile') {
    return (
      <Link href="/settings">
        <a className="btn btn-sm btn-outline-secondary action-btn">
          <i className="ion-gear-a"></i> Edit Profile Settings
        </a>
      </Link>
    );
  }

  return (
    <Link href={`editor/${props.slug}`}>
      <a className="btn btn-outline-secondary btn-sm">
        <i className="ion-edit"></i> Edit Article
      </a>
    </Link>
  );
}
