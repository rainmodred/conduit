import userEvent from '@testing-library/user-event';
import {
  mockUser,
  render,
  renderWithAuthProvider,
  screen,
  waitFor,
} from '../../test-utils';
import Register from '../../pages/register';

const testUser = {
  email: 'test@example.com',
  username: 'test',
  password: 'test',
};

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

  it('should show missing password error', async () => {
    render(renderWithAuthProvider(<Register />));
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), testUser.email);

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    expect(screen.getByText('password is required')).toBeInTheDocument();
  });

  it('should show missing email error', async () => {
    render(renderWithAuthProvider(<Register />));
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/password/i),
      testUser.password,
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    expect(screen.getByText('email is required')).toBeInTheDocument();
  });

  it('should show missing username error', async () => {
    render(renderWithAuthProvider(<Register />));
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), testUser.email);
    await user.type(
      screen.getByPlaceholderText(/password/i),
      testUser.password,
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    expect(screen.getByText('username is required')).toBeInTheDocument();
  });

  it('should show error if username has been taken', async () => {
    render(renderWithAuthProvider(<Register />));
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/username/i), 'error');
    await user.type(screen.getByPlaceholderText(/email/i), testUser.email);
    await user.type(
      screen.getByPlaceholderText(/password/i),
      testUser.password,
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    expect(
      await screen.findByText('username has already been taken'),
    ).toBeInTheDocument();
  });

  it('should show error if email has been taken', async () => {
    render(renderWithAuthProvider(<Register />));
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/username/i),
      testUser.username,
    );
    await user.type(screen.getByPlaceholderText(/email/i), 'error@example.com');
    await user.type(
      screen.getByPlaceholderText(/password/i),
      testUser.password,
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    expect(
      await screen.findByText('email has already been taken'),
    ).toBeInTheDocument();
  });

  it('should redirect on register', async () => {
    const push = jest.fn();
    render(renderWithAuthProvider(<Register />), { router: { push } });
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/username/i),
      testUser.username,
    );
    await user.type(screen.getByPlaceholderText(/email/i), testUser.email);
    await user.type(
      screen.getByPlaceholderText(/password/i),
      testUser.password,
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    await waitFor(() => expect(push).toBeCalledWith('/'));
  });

  it('should redirect if user already logged in', () => {
    const push = jest.fn();
    render(renderWithAuthProvider(<Register />, mockUser), {
      router: { pathname: '/', push },
    });

    expect(push).toBeCalledWith('/');
  });
});
