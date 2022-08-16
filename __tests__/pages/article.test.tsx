import userEvent from '@testing-library/user-event';
import {
  render,
  renderWithAuthProvider,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../../test/test-utils';

import Article from '../../pages/article/[slug]';
// import { server } from '../../mocks/server';
// import { rest } from 'msw';

import { API_URL } from '../../config/config';
import {
  authenticate,
  sanitizeArticle,
  sanitizeProfile,
} from '../../mocks/serverUtils';
// import { Article as IArticle, User, Profile } from '../../utils/types';
import { createArticle, createUser } from '../../mocks/db';

describe('Article page', () => {
  describe('Article Header', () => {
    // let sanitizedProfile: Profile;
    // let sanitizedArticle: IArticle;
    beforeEach(() => {
      // const { userInDB: authorUser } = createUser();
      // ({ userRef, userInDB } = createUser());
      // const mockedArticle = createArticle(userInDB);
      // sanitizedProfile = sanitizeProfile(mockedArticle.author, {
      //   following: false,
      // });
      // // sanitizedArticle = {
      // //   ...sanitizeArticle(mockedArticle),
      // //   author: sanitizedProfile,
      // //   favorited: false,
      // // };
      // sanitizedArticle = sanitizeArticle(mockedArticle, {
      //   author: sanitizedProfile,
      //   favorited: false,
      // });
    });
    it('should redirect to register on follow click if user is unauthorized', async () => {
      const user = userEvent.setup();

      const author = createUser();
      const { slug } = createArticle({
        author,
      });

      const push = jest.fn();
      render(renderWithAuthProvider(<Article />), {
        router: { query: { slug }, push },
      });

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

      await user.click(
        screen.getByRole('button', {
          name: `Follow ${author.username}`,
        }),
      );

      expect(push).toBeCalledWith('/register');
    });

    it('should redirect to register on favorite click if user is unauthorized', async () => {
      const user = userEvent.setup();

      const author = createUser();
      const { slug } = createArticle({
        author,
      });

      const push = jest.fn();
      render(renderWithAuthProvider(<Article />), {
        router: { query: { slug }, push },
      });

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

      await user.click(
        screen.getByRole('button', {
          name: /favorite article/i,
        }),
      );

      expect(push).toBeCalledWith('/register');
    });

    it('should follow/unfollow author', async () => {
      const user = userEvent.setup();

      const { email, password } = createUser();
      const { user: testUser } = authenticate({
        email: email,
        password: password,
      });
      const author = createUser();
      const { slug } = createArticle({
        author,
      });

      render(renderWithAuthProvider(<Article />, testUser), {
        router: { query: { slug } },
      });

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
      const followButton = screen.getByRole('button', {
        name: `Follow ${author.username}`,
      });

      await user.click(followButton);
      const unfollowButton = await screen.findByRole('button', {
        name: `Unfollow ${author.username}`,
      });
      expect(unfollowButton).toBeInTheDocument();
      await waitFor(() => expect(unfollowButton).toBeEnabled());

      await user.click(unfollowButton);
      expect(followButton).toBeInTheDocument();
    });

    it('should add and remove article from favorites', async () => {
      const user = userEvent.setup();

      const { email, password } = createUser();
      const { user: testUser } = authenticate({
        email: email,
        password: password,
      });
      const author = createUser();
      const { slug } = createArticle({
        author,
      });

      render(renderWithAuthProvider(<Article />, testUser), {
        router: { query: { slug } },
      });

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
      const favotireButton = screen.getByRole('button', {
        name: /favorite article/i,
      });

      await user.click(favotireButton);
      const unFavoriteButton = await screen.findByRole('button', {
        name: /favorite article/i,
      });
      expect(unFavoriteButton).toBeInTheDocument();
      await waitFor(() => expect(unFavoriteButton).toBeEnabled());

      await user.click(unFavoriteButton);
      expect(favotireButton).toBeInTheDocument();
    });

    it('should delete article', async () => {
      const user = userEvent.setup();

      const { email, password, id } = createUser();
      const { user: testUser } = authenticate({
        email: email,
        password: password,
      });
      const { slug } = createArticle({
        author: {
          id,
        },
      });

      const push = jest.fn();
      render(renderWithAuthProvider(<Article />, testUser), {
        router: { query: { slug }, push },
      });

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

      const deleteButton = screen.getByRole('button', {
        name: /delete article/i,
      });
      await user.click(deleteButton);

      expect(deleteButton).toBeDisabled();
      expect(push).toBeCalledWith('/');
    });
  });
});
