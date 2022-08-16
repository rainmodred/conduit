import {
  render,
  screen,
  userEvent,
  renderWithAuthProvider,
} from '../../test/test-utils';
import RegisterForm from './RegisterForm';
import { buildUser } from '../../mocks/data-generators';
import { createUser } from '../../mocks/db';

describe('RegisterForm', () => {
  it('should show missing password error', async () => {
    render(renderWithAuthProvider(<RegisterForm />));
    const user = userEvent.setup();
    const { email } = buildUser();

    await user.type(screen.getByPlaceholderText(/email/i), email);
    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    expect(
      await screen.findByRole('alert', {
        name: /password is required/i,
      }),
    ).toBeInTheDocument();
  });

  it('should show error if username has been taken', async () => {
    render(renderWithAuthProvider(<RegisterForm />));
    const user = userEvent.setup();

    const { username, password } = createUser();

    await user.type(screen.getByPlaceholderText(/username/i), username);
    await user.type(screen.getByPlaceholderText(/email/i), 'email');
    await user.type(screen.getByPlaceholderText(/password/i), password);

    await userEvent.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    );

    expect(
      await screen.findByRole('alert', {
        name: /username has already been taken/i,
      }),
    ).toBeInTheDocument();
  });
});
