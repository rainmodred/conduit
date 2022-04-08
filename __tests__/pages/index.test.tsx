import { render, screen } from '../../test-utils';
import Home from '../../pages/index';
import { waitForElementToBeRemoved } from '@testing-library/react';

describe('Home page', () => {
  it('should render', async () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        name: /conduit/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a place to share your knowledge\./i),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', {
        name: /create a new implementation/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /explore implementations/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /welcome to realworld project/i,
      }),
    ).toBeInTheDocument();
  });

  it('should filter articles by tag', async () => {
    render(<Home />, {
      router: { query: { tag: 'welcome' } },
    });

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(
      screen.getByRole('heading', {
        name: /welcome to realworld project/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /create a new implementation/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /explore implementations/i,
      }),
    ).not.toBeInTheDocument();
  });
});
