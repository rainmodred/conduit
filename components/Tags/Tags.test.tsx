import Tags from './Tags';
import { render, screen } from '../../test/test-utils';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '../../mocks/server';
import { API_URL } from '../../config/config';
import db from '../../mocks/db';

describe('Tags', () => {
  it('should render', async () => {
    const tags = [
      db.tag.create({ id: '1', name: 'first' }),
      db.tag.create({ id: '2', name: 'second' }),
    ];
    render(<Tags />);

    expect(screen.getByText(/popular tags/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    tags.forEach(tag => {
      expect(
        screen.getByRole('link', {
          name: tag.name,
        }),
      ).toBeInTheDocument();
    });
  });

  it('should show error', async () => {
    server.use(
      rest.get(`${API_URL}/tags`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({}));
      }),
    );
    render(<Tags />);

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });
});
