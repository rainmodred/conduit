import Link from 'next/link';
import useTags from '../../hooks/useTags';

export default function Tags() {
  const { data, isLoading, error } = useTags();
  const tags = data?.tags ?? [];

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {isLoading ? (
          <p>Loading tags...</p>
        ) : error ? (
          <p>Something went wrong</p>
        ) : (
          tags.map(tag => (
            <Link href={`/tag/${tag}`} key={`tag-${tag}`}>
              <a className="tag-pill tag-default">{tag}</a>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
