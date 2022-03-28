import { render, screen } from '../../test-utils';
import Home from '../../pages/index';

describe('Header', () => {
  it('should render the Header', () => {
    render(<Home />);

    expect(
      screen.getByRole('link', {
        name: /conduit/i,
      }),
    ).toBeInTheDocument();
  });
});
