import userEvent from '@testing-library/user-event';
import {
  render,
  renderWithAuthProvider,
  screen,
  waitFor,
} from '../../test/test-utils';

import Register from '../../pages/register';
import { createUser } from '../../mocks/db';
import { buildUser } from '../../mocks/data-generators';
import { authenticate } from '../../mocks/serverUtils';

describe('register page', () => {
  it('should render', () => {
    render(renderWithAuthProvider(<Register />));

    expect(
      screen.getByRole('heading', {
        name: /sign up/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should have link to register page', async () => {
    render(renderWithAuthProvider(<Register />));

    expect(
      screen.getByRole('link', {
        name: 'Have an account?',
      }),
    ).toHaveAttribute('href', '/login');
  });

  it('should redirect onRegister', async () => {
    const push = jest.fn();
    render(renderWithAuthProvider(<Register />), { router: { push } });
    const user = userEvent.setup();
    const { username, email, password } = buildUser();

    await user.type(screen.getByPlaceholderText(/username/i), username);
    await user.type(screen.getByPlaceholderText(/email/i), email);
    await user.type(screen.getByPlaceholderText(/password/i), password);
    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    await waitFor(() => expect(push).toBeCalledWith('/'));
  });

  it('should redirect to "/" if user already logged in', () => {
    const push = jest.fn();
    const { email, password } = createUser();
    const { user } = authenticate({
      email: email,
      password: password,
    });

    render(renderWithAuthProvider(<Register />, user), {
      router: { pathname: '/', push },
    });

    expect(push).toBeCalledWith('/');
  });
});
