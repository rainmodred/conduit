import userEvent from '@testing-library/user-event';
import {
  render,
  renderWithAuthProvider,
  screen,
  waitFor,
} from '../../test/test-utils';
import Login from '../../pages/login';
import db from '../../mocks/db';
import { buildUser } from '../../mocks/data-generators';
import { hash, sanitizeUser } from '../../mocks/serverUtils';

const password = '12345';
const testUser = db.user.create(buildUser({ password: hash(password) }));

describe('Login page', () => {
  it('should render', () => {
    render(renderWithAuthProvider(<Login />));

    expect(
      screen.getByRole('heading', {
        name: /sign in/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should have link to register page', async () => {
    render(renderWithAuthProvider(<Login />));

    expect(
      screen.getByRole('link', {
        name: 'Need an account?',
      }),
    ).toHaveAttribute('href', '/register');
  });

  it('should show missing password error', async () => {
    render(renderWithAuthProvider(<Login />));
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), testUser.email);

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    );

    expect(screen.getByText('password is required')).toBeInTheDocument();
  });

  it('should show missing email error', async () => {
    render(renderWithAuthProvider(<Login />));
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/password/i), password);

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    );

    expect(screen.getByText('email is required')).toBeInTheDocument();
  });

  it('should show invalid credentials error', async () => {
    render(renderWithAuthProvider(<Login />));
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), testUser.email);
    await user.type(
      screen.getByPlaceholderText(/password/i),
      'invalid password',
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    );

    expect(
      await screen.findByText('email or password is invalid'),
    ).toBeInTheDocument();
  });

  it('should redirect on login', async () => {
    const push = jest.fn();
    render(renderWithAuthProvider(<Login />), { router: { push } });
    const user = userEvent.setup();

    const testUser = db.user.create(buildUser({ password: hash(password) }));

    await user.type(screen.getByPlaceholderText(/email/i), testUser.email);
    await user.type(screen.getByPlaceholderText(/password/i), password);

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    );

    await waitFor(() => expect(push).toBeCalledWith('/'));
  });

  it('should redirect if user already logged in', () => {
    const push = jest.fn();
    const mockUser = sanitizeUser(
      db.user.create(buildUser({ password: hash(testUser.password) })),
    );
    render(renderWithAuthProvider(<Login />, mockUser), {
      router: { pathname: '/', push },
    });

    expect(push).toBeCalledWith('/');
  });
});
