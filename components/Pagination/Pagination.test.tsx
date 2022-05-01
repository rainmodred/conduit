import { render, screen } from '../../test/test-utils';
import Pagination from './Pagination';

const totalPages = 3;

describe('Pagination', () => {
  it('should render', () => {
    render(<Pagination totalPages={totalPages} />);

    expect(screen.getByText(1)).toHaveAttribute('href', '/?page=1');
    expect(screen.getByText(2)).toHaveAttribute('href', '/?page=2');
    expect(screen.getByText(3)).toHaveAttribute('href', '/?page=3');
  });
});
