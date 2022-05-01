import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test/test-utils';
import DeleteButton from './DeleteButton';

describe('DeleteButton', () => {
  it('should render', () => {
    render(<DeleteButton disabled={false} onClick={jest.fn} />);

    const button = screen.getByRole('button', {
      name: /delete article/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('should be disabled', async () => {
    render(<DeleteButton disabled={true} onClick={jest.fn} />);

    expect(
      screen.getByRole('button', {
        name: /delete article/i,
      }),
    ).toBeDisabled();
  });

  it('should call onClick fn', async () => {
    const fn = jest.fn();
    const user = userEvent.setup();
    render(<DeleteButton disabled={false} onClick={fn} />);

    await user.click(
      screen.getByRole('button', {
        name: /delete article/i,
      }),
    );

    expect(fn).toBeCalledTimes(1);
  });
});
