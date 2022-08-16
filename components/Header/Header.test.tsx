import Header from './Header';
import { render, renderWithAuthProvider, screen } from '../../test/test-utils';
import { authenticate } from '../../mocks/serverUtils';
import { createUser } from '../../mocks/db';

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
    const { email, password } = createUser();
    const { user } = authenticate({
      email: email,
      password: password,
    });

    render(renderWithAuthProvider(<Header />, user));

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
