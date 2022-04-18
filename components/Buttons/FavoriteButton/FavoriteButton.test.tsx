import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  it('should render lg favorite button', () => {
    render(
      <FavoriteButton favorited={false} onClick={jest.fn} size="lg">
        3
      </FavoriteButton>,
    );

    expect(
      screen.getByRole('button', {
        name: /favorite article \(3\)/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render lg unfavorite button', () => {
    render(
      <FavoriteButton favorited={true} onClick={jest.fn} size="lg">
        3
      </FavoriteButton>,
    );

    expect(
      screen.getByRole('button', {
        name: /unfavorite article \(3\)/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render sm button', () => {
    render(
      <FavoriteButton favorited={true} onClick={jest.fn} size="sm">
        3
      </FavoriteButton>,
    );

    expect(
      screen.queryByRole('button', {
        name: /unfavorite article/i,
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/3/i)).toBeInTheDocument();
  });

  it('should call onClick fn', async () => {
    const fn = jest.fn();
    const user = userEvent.setup();
    render(
      <FavoriteButton favorited={false} onClick={fn} size="lg">
        3
      </FavoriteButton>,
    );

    await user.click(
      screen.getByRole('button', {
        name: /favorite article \(3\)/i,
      }),
    );

    expect(fn).toBeCalledTimes(1);
  });
});
