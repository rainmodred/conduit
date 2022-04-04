import { render, screen, waitFor } from '../../test-utils';

import userEvent from '@testing-library/user-event';

import { useRouter } from 'next/router';
import Login from '../../pages/login';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Login page', () => {
  const push = jest.fn();
  useRouter.mockImplementation(() => ({
    push,
    pathname: '/',
    route: '/',
    asPath: '/',
    query: '',
  }));
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', {
        name: /sign in/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should show missing password error', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    );

    expect(screen.getByText('password is required')).toBeInTheDocument();
  });

  it('should show missing email error', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/password/i), 'password');

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    );

    expect(screen.getByText('email is required')).toBeInTheDocument();
  });

  it('should show invalid credentials error', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'error');

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
    render(<Login />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/email/i),
      'conduitTest@example.com',
    );
    await user.type(screen.getByPlaceholderText(/password/i), 'conduitTest');

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    );

    await waitFor(() => expect(push).toBeCalledWith('/'));
  });
});
