import userEvent from '@testing-library/user-event';
import { render, renderWithAuthProvider, screen } from '../test-utils';
import { mockUser } from '../mocks/mock';
import Article from '../pages/article/[slug]';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { apiUrl } from '../api';

const mockArticle = {
  slug: 'Create-a-new-implementation-1',
  title: 'Create a new implementation',
  description: 'join the community by creating a new implementation',
  body: 'Share your knowledge and enpower the community by creating a new implementation',
  tagList: ['implementations'],
  createdAt: '2021-11-24T12:11:08.212Z',
  updatedAt: '2021-11-24T12:11:08.212Z',
  favorited: false,
  favoritesCount: 1901,
  author: {
    username: 'Gerome',
    bio: null,
    image: 'https://api.realworld.io/images/demo-avatar.png',
    following: false,
  },
};

describe('Article page', () => {
  describe('Header', () => {
    it('renders', () => {
      render(renderWithAuthProvider(<Article article={mockArticle} />), {
        router: { pathname: '/article/hello' },
      });

      expect(
        screen.getByRole('heading', {
          name: /create a new implementation/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: /gerome/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(/november 24, 2021/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: /^follow gerome/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: /^favorite article/i,
        }),
      ).toBeInTheDocument();
    });

    it('should redirect to register on follow click if user unauthorized', async () => {
      const push = jest.fn();
      render(renderWithAuthProvider(<Article article={mockArticle} />), {
        router: { pathname: '/article/hello', push },
      });
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', {
          name: /^follow gerome/i,
        }),
      );

      expect(push).toBeCalledWith('/register');
    });

    it('should redirect to register on favorite click if user unauthorized', async () => {
      const push = jest.fn();
      render(renderWithAuthProvider(<Article article={mockArticle} />), {
        router: { pathname: '/article/hello', push },
      });
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', {
          name: /^favorite article/i,
        }),
      );

      expect(push).toBeCalledWith('/register');
    });

    it('should change follow button state', async () => {
      server.use(
        rest.post(`${apiUrl}/profiles/:username/follow`, (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              profile: {
                username: 'Gerome',
                bio: null,
                image: 'https://api.realworld.io/images/demo-avatar.png',
                following: true,
              },
            }),
          );
        }),

        rest.get(`${apiUrl}/articles/:slug`, (_req, res, ctx) => {
          const article = {
            ...mockArticle,
            author: { ...mockArticle.author, following: true },
          };

          return res(ctx.status(200), ctx.json({ article }));
        }),
      );
      const push = jest.fn();
      render(
        renderWithAuthProvider(<Article article={mockArticle} />, mockUser),
        {
          router: { pathname: '/article/hello', push },
        },
      );
      const user = userEvent.setup();
      const followButton = screen.getByRole('button', {
        name: /^follow gerome/i,
      });

      await user.click(followButton);

      expect(followButton).toBeDisabled();

      expect(
        await screen.findByRole('button', {
          name: /unfollow gerome/i,
        }),
      ).toBeInTheDocument();
    });

    // Todo fix
    it.skip('should add article to favorites', async () => {
      const article = {
        ...mockArticle,
        favorited: true,
        favoritesCount: mockArticle.favoritesCount + 1,
      };
      server.use(
        rest.post(`${apiUrl}/articles/:slug/favorite`, (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              article,
            }),
          );
        }),

        rest.get(`${apiUrl}/articles/:slug`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ article: mockArticle }));
        }),
      );

      render(
        renderWithAuthProvider(<Article article={mockArticle} />, mockUser),
        {
          router: { pathname: '/article/hello' },
        },
      );
      const user = userEvent.setup();

      server.use(
        rest.get(`${apiUrl}/articles/:slug`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ article: article }));
        }),
      );

      await user.click(
        screen.getByRole('button', {
          name: /^favorite article/i,
        }),
      );

      expect(
        await screen.findByRole('button', {
          name: /unfavorite article/i,
        }),
      ).toHaveTextContent('Unfavorite Article (1902)');
      expect(
        await screen.findByRole('button', {
          name: /unfavorite article/i,
        }),
      ).toBeEnabled();
    });

    it.skip('should remove article from favorites', async () => {
      const article = {
        ...mockArticle,
        favorited: true,
        favoritesCount: mockArticle.favoritesCount - 1,
      };
      server.use(
        rest.post(`${apiUrl}/articles/:slug/favorite`, (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              article,
            }),
          );
        }),

        rest.get(`${apiUrl}/articles/:slug`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ article }));
        }),
      );

      render(
        renderWithAuthProvider(<Article article={mockArticle} />, mockUser),
        {
          router: { pathname: '/article/hello' },
        },
      );
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', {
          name: /^favorite article/i,
        }),
      );

      expect(
        await screen.findByRole('button', {
          name: /unfavorite article/i,
        }),
      ).toHaveTextContent('Unfavorite Article (1902)');
      expect(
        await screen.findByRole('button', {
          name: /unfavorite article/i,
        }),
      ).toBeEnabled();
    });

    it('should delete article', async () => {
      const push = jest.fn();

      const article = {
        ...mockArticle,
        author: { ...mockArticle.author, username: mockUser.username },
      };

      render(renderWithAuthProvider(<Article article={article} />, mockUser), {
        router: { pathname: '/article/hello', push },
      });
      const user = userEvent.setup();
      const deleteButton = screen.getByRole('button', {
        name: /delete article/i,
      });
      await user.click(deleteButton);

      expect(deleteButton).toBeDisabled();
      expect(push).toBeCalledWith('/');
    });
  });
});
