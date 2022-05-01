import Tags from './Tags';
import { render, screen } from '../../test/test-utils';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '../../mocks/server';
import { apiUrl } from '../../api';

describe('Tags', () => {
  it('should render', async () => {
    render(<Tags />);

    expect(screen.getByText(/popular tags/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.getByText(/loading/i));
    expect(
      screen.getByRole('link', {
        name: /welcome/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /implementations/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /codebaseshow/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /introduction/i,
      }),
    ).toBeInTheDocument();
  });

  it('should show error', async () => {
    server.use(
      rest.get(`${apiUrl}/tags`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({}));
      }),
    );
    render(<Tags />);

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });
});
