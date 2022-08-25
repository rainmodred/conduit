import { render, renderWithAuthProvider, screen } from '../../test/test-utils';

import Home from '../../pages/index';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { authenticate } from '../../mocks/serverUtils';
import { createArticle, createUser } from '../../mocks/db';

describe('Home page', () => {
  it('should show feed', async () => {
    const follower = createUser();
    const author = createUser({ followedBy: [follower] });

    const articles = Array.from({ length: 3 }).map(() =>
      createArticle({ author }),
    );

    const { user } = authenticate({
      email: follower.email,
      password: follower.password,
    });
    render(renderWithAuthProvider(<Home />, user));

    await waitForElementToBeRemoved(() =>
      screen.getByText(/loading articles/i),
    );

    expect(
      screen.getByRole('link', {
        name: /your feed/i,
      }),
    ).toBeInTheDocument();

    articles.forEach(({ title, description }) => {
      expect(
        screen.getByRole('heading', {
          name: title,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('should redirect to all if user is not logged in', async () => {
    const push = jest.fn();
    render(
      renderWithAuthProvider(
        <AuthProvider>
          <Home />
        </AuthProvider>,
      ),
      { router: { push } },
    );

    expect(push).toBeCalledWith({ pathname: '/all' });
  });
});
