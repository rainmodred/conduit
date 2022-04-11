import {
  mockUser,
  render,
  renderWithAuthProvider,
  screen,
} from '../../test-utils';
import Home from '../../pages/index';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import { apiUrl } from '../../api';
import { server } from '../../mocks/server';

describe('Home page', () => {
  it('should render', async () => {
    render(renderWithAuthProvider(<Home />));

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

  it('should show error articles count = 0', async () => {
    server.use(
      rest.get(`${apiUrl}/articles`, (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            articles: [],
            articlesCount: 0,
          }),
        );
      }),
    );

    render(renderWithAuthProvider(<Home />));
    await waitForElementToBeRemoved(() =>
      screen.getByText(/loading articles/i),
    );
    expect(
      screen.getByText(/no articles are here\.\.\. yet\./i),
    ).toBeInTheDocument();
  });

  it('should filter articles by tag', async () => {
    render(renderWithAuthProvider(<Home />), {
      router: { query: { tag: 'welcome' } },
    });

    await waitForElementToBeRemoved(() =>
      screen.getByText(/loading articles/i),
    );

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

  it('should redirect to feed if user logged in', () => {
    const push = jest.fn();
    render(renderWithAuthProvider(<Home />, mockUser), { router: { push } });

    expect(push).toBeCalledWith({ query: { feed: 'user' } });
  });

  it('should show feed', async () => {
    render(renderWithAuthProvider(<Home />, mockUser), {
      router: { asPath: `/?feed=${mockUser.username}` },
    });

    await waitForElementToBeRemoved(() =>
      screen.getByText(/loading articles/i),
    );

    expect(
      screen.getByRole('link', {
        name: /your feed/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /feed article/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /create a new implementation/i,
      }),
    ).not.toBeInTheDocument();
  });

  it.skip('should logout on 401', async () => {
    server.use(
      rest.get(`${apiUrl}/articles/feed`, (_req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            status: 'error',
            message: 'missing authorization credentials',
          }),
        );
      }),
    );

    render(renderWithAuthProvider(<Home />, mockUser));
    await waitForElementToBeRemoved(() =>
      screen.getByText(/loading articles/i),
    );

    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });
});
