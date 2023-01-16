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

  it('should disable inputs and submit button if form isSubmitting', async () => {
    render(renderWithAuthProvider(<RegisterForm />));
    const user = userEvent.setup();

    const { username, email, password } = createUser();
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', {
      name: /sign up/i,
    });

    await user.type(usernameInput, username);
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await userEvent.click(submitButton);

    expect(usernameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
