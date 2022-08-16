import { render, screen } from '../../../../test/test-utils';
import EditButton from './EditButton';

describe('EditButton', () => {
  it('should render edit article button', () => {
    render(<EditButton type="article" slug="test" />);

    expect(
      screen.getByRole('link', {
        name: /edit article/i,
      }),
    ).toHaveAttribute('href', '/editor/test');
  });

  it('should render edit profile button', () => {
    render(<EditButton type="profile" />);

    expect(
      screen.getByRole('link', {
        name: /edit profile/i,
      }),
    ).toHaveAttribute('href', '/settings');
  });
});
