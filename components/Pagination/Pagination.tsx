import Link from 'next/link';
import usePagination from './usePagination';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({
  totalPages,
}: PaginationProps): JSX.Element {
  const { range, activePage } = usePagination(totalPages);

  return (
    <nav>
      <ul className="pagination">
        {range.map(page => (
          <li
            key={`page-${page}`}
            className={`page-item ${activePage === page ? 'active' : ''}`}
          >
            <Link href={`?page=${page}`}>
              <a className="page-link">{page}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
