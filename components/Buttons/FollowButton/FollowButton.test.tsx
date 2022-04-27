import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils';
import FollowButton from './FollowButton';

describe('FollowButton', () => {
  it('should render', () => {
    render(
      <FollowButton followed={false} onClick={jest.fn} disabled={false}>
        Tom
      </FollowButton>,
    );

    expect(
      screen.getByRole('button', {
        name: /follow Tom/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render button with unfollow text', () => {
    render(
      <FollowButton followed={true} onClick={jest.fn} disabled={false}>
        Tom
      </FollowButton>,
    );

    expect(
      screen.getByRole('button', {
        name: /unfollow Tom/i,
      }),
    ).toBeInTheDocument();
  });

  it('should call onClick fn', async () => {
    const fn = jest.fn();
    const user = userEvent.setup();
    render(
      <FollowButton followed={false} onClick={fn} disabled={false}>
        Tom
      </FollowButton>,
    );

    await user.click(
      screen.getByRole('button', {
        name: /follow Tom/i,
      }),
    );

    expect(fn).toBeCalledTimes(1);
  });

  it('should be disabled', () => {
    const fn = jest.fn();

    render(
      <FollowButton followed={false} onClick={fn} disabled={true}>
        Tom
      </FollowButton>,
    );
    expect(screen.getByRole('button', { name: /follow Tom/i })).toBeDisabled();
  });
});
