import Header from './Header';
import { render, renderWithAuthProvider, screen } from '../../test-utils';
import { mockUser } from '../../mocks/mock';

describe('Header', () => {
  it('should render', () => {
    render(renderWithAuthProvider(<Header />));

    expect(screen.getByText(/conduit/i)).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', {
        name: /home/i,
      }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', {
        name: /sign in/i,
      }),
    ).toHaveAttribute('href', '/login');
    expect(
      screen.getByRole('link', {
        name: /sign up/i,
      }),
    ).toHaveAttribute('href', '/register');
  });

  it('should change NavLink if user logged in', () => {
    render(renderWithAuthProvider(<Header />, mockUser));

    expect(screen.getByText(/conduit$/i)).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', {
        name: /home/i,
      }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', {
        name: /new article/i,
      }),
    ).toHaveAttribute('href', '/editor');
    expect(
      screen.getByRole('link', {
        name: /settings/i,
      }),
    ).toHaveAttribute('href', '/settings');
  });
});
