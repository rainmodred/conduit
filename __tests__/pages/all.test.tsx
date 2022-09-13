import { render, renderWithAuthProvider, screen } from '../../test/test-utils';

import All from '../../pages/all';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { createArticle, createUser } from '../../mocks/db';

describe('All page', () => {
  it('should load articles', async () => {
    const author = createUser();

    const articles = Array.from({ length: 3 }).map(() =>
      createArticle({ author }),
    );

    render(renderWithAuthProvider(<All />));

    await waitForElementToBeRemoved(() =>
      screen.getByText(/loading articles/i),
    );

    expect(
      screen.getByRole('link', {
        name: /global feed/i,
      }),
    ).toHaveAttribute('href', '/all');

    articles.forEach(({ title, description }) => {
      expect(
        screen.getByRole('heading', {
          name: title,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });
});
