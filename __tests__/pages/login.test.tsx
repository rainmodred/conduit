import {
  userEvent,
  render,
  renderWithAuthProvider,
  screen,
  waitFor,
} from '../../test/test-utils';

import Login from '../../pages/login';
import { createUser } from '../../mocks/db';
import { authenticate } from '../../mocks/serverUtils';

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

  it('should redirect on login', async () => {
    const push = jest.fn();
    render(renderWithAuthProvider(<Login />), { router: { push } });
    const user = userEvent.setup();
    const { email, password } = createUser();

    await user.type(screen.getByPlaceholderText(/email/i), email);
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
    const { email, password } = createUser();
    const { user } = authenticate({
      email: email,
      password: password,
    });

    render(renderWithAuthProvider(<Login />, user), {
      router: { pathname: '/', push },
    });

    expect(push).toBeCalledWith('/');
  });
});
