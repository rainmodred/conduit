import { createUser, createArticle } from '../../../mocks/db';
import { authenticate } from '../../../mocks/serverUtils';
import {
  userEvent,
  render,
  renderWithAuthProvider,
  screen,
} from '../../../test/test-utils';
import ArticleControls from './ArticleControls';

describe('ArticleControl', () => {
  it('should redirect to register on follow click if user is unauthorized', async () => {
    const user = userEvent.setup();

    const author = createUser();
    const { slug, createdAt, favoritesCount } = createArticle({
      author,
    });

    const push = jest.fn();
    render(
      renderWithAuthProvider(
        <ArticleControls
          slug={slug}
          isDisabled={false}
          isFavorited={false}
          isFollowing={false}
          onDelete={jest.fn}
          onFavorite={jest.fn}
          onFollow={jest.fn}
          author={{
            username: author.username,
            bio: author.bio,
            following: false,
            image: author.image,
          }}
          createdAt={createdAt}
          favoritesCount={favoritesCount}
        />,
      ),
      {
        router: { query: { slug }, push },
      },
    );

    await user.click(
      screen.getAllByRole('button', {
        name: `Follow ${author.username}`,
      })[0],
    );

    expect(push).toBeCalledWith('/register');
  });

  it('should redirect to register on favorite click if user is unauthorized', async () => {
    const user = userEvent.setup();

    const author = createUser();
    const { slug, createdAt, favoritesCount } = createArticle({
      author,
    });

    const push = jest.fn();
    render(
      renderWithAuthProvider(
        <ArticleControls
          slug={slug}
          isDisabled={false}
          isFavorited={false}
          isFollowing={false}
          onDelete={jest.fn}
          onFavorite={jest.fn}
          onFollow={jest.fn}
          author={{
            username: author.username,
            bio: author.bio,
            following: false,
            image: author.image,
          }}
          createdAt={createdAt}
          favoritesCount={favoritesCount}
        />,
      ),
      {
        router: { query: { slug }, push },
      },
    );

    await user.click(
      screen.getAllByRole('button', {
        name: /favorite article/i,
      })[0],
    );

    expect(push).toBeCalledWith('/register');
  });

  it('should follow author', async () => {
    const user = userEvent.setup();

    const { email, password } = createUser();
    const { user: testUser } = authenticate({
      email: email,
      password: password,
    });
    const author = createUser();
    const { slug, createdAt, favoritesCount } = createArticle({
      author,
    });

    const onFollow = jest.fn();

    render(
      renderWithAuthProvider(
        <ArticleControls
          slug={slug}
          isDisabled={false}
          isFavorited={false}
          isFollowing={false}
          onDelete={jest.fn}
          onFavorite={jest.fn}
          onFollow={onFollow}
          author={{
            username: author.username,
            bio: author.bio,
            following: false,
            image: author.image,
          }}
          createdAt={createdAt}
          favoritesCount={favoritesCount}
        />,
        testUser,
      ),
      {
        router: { query: { slug } },
      },
    );

    const followButton = screen.getByRole('button', {
      name: `Follow ${author.username}`,
    });

    expect(followButton).toBeEnabled();
    await user.click(followButton);
    expect(onFollow).toBeCalledTimes(1);
  });

  it('should unfollow author', async () => {
    const user = userEvent.setup();

    const { email, password } = createUser();
    const { user: testUser } = authenticate({
      email: email,
      password: password,
    });
    const author = createUser();
    const { slug, createdAt, favoritesCount } = createArticle({
      author,
    });

    const onFollow = jest.fn();

    render(
      renderWithAuthProvider(
        <ArticleControls
          slug={slug}
          isDisabled={false}
          isFavorited={false}
          isFollowing={true}
          onDelete={jest.fn}
          onFavorite={jest.fn}
          onFollow={onFollow}
          author={{
            username: author.username,
            bio: author.bio,
            following: true,
            image: author.image,
          }}
          createdAt={createdAt}
          favoritesCount={favoritesCount}
        />,
        testUser,
      ),
      {
        router: { query: { slug } },
      },
    );

    const unFollowButton = screen.getByRole('button', {
      name: `Unfollow ${author.username}`,
    });

    expect(unFollowButton).toBeEnabled();
    await user.click(unFollowButton);
    expect(onFollow).toBeCalledTimes(1);
  });

  it('should add article to favorites', async () => {
    const user = userEvent.setup();

    const { email, password } = createUser();
    const { user: testUser } = authenticate({
      email: email,
      password: password,
    });
    const author = createUser();
    const { slug, createdAt, favoritesCount } = createArticle({
      author,
    });

    const onFavorite = jest.fn();
    render(
      renderWithAuthProvider(
        <ArticleControls
          slug={slug}
          isDisabled={false}
          isFavorited={false}
          isFollowing={true}
          onDelete={jest.fn}
          onFavorite={onFavorite}
          onFollow={jest.fn}
          author={{
            username: author.username,
            bio: author.bio,
            following: true,
            image: author.image,
          }}
          createdAt={createdAt}
          favoritesCount={favoritesCount}
        />,
        testUser,
      ),
      {
        router: { query: { slug } },
      },
    );

    const favotireButton = screen.getByRole('button', {
      name: /favorite article/i,
    });

    await user.click(favotireButton);
    expect(onFavorite).toBeCalledTimes(1);
  });

  it('should delete article', async () => {
    const user = userEvent.setup();

    const author = createUser();
    const { user: testUser } = authenticate({
      email: author.email,
      password: author.password,
    });

    const { slug, createdAt, favoritesCount } = createArticle({
      author,
    });

    const onDelete = jest.fn();
    render(
      renderWithAuthProvider(
        <ArticleControls
          slug={slug}
          isDisabled={false}
          isFavorited={false}
          isFollowing={false}
          onDelete={onDelete}
          onFavorite={jest.fn}
          onFollow={jest.fn}
          author={{
            username: author.username,
            bio: author.bio,
            following: true,
            image: author.image,
          }}
          createdAt={createdAt}
          favoritesCount={favoritesCount}
        />,
        testUser,
      ),
      {
        router: { query: { slug } },
      },
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete article/i,
    });
    await user.click(deleteButton);

    expect(onDelete).toBeCalledWith();
  });
});
