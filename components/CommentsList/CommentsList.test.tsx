import { buildComment } from '../../mocks/data-generators';
import { createArticle, createComment, createUser } from '../../mocks/db';
import { authenticate } from '../../mocks/serverUtils';
import {
  renderWithAuthProvider,
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from '../../test/test-utils';
import CommentsList from './CommentsList';

const DELETE_BTN = 'delete-comment';
const COMMENTS_COUNT = 3;

describe('CommentsList', () => {
  it('should render', async () => {
    const author = createUser();
    const article = createArticle({ author });

    Array.from({ length: COMMENTS_COUNT }).map(() =>
      createComment({ author, article }),
    );

    render(renderWithAuthProvider(<CommentsList />), {
      router: { query: { slug: article.slug } },
    });

    await waitForElementToBeRemoved(() => screen.getByText('Loading...'));

    expect(screen.getAllByTestId('comment')).toHaveLength(COMMENTS_COUNT);
  });

  it('should delete comment', async () => {
    const author = createUser();
    const article = createArticle({ author });
    const { user: testUser } = authenticate({
      email: author.email,
      password: author.password,
    });

    const user = userEvent.setup();

    Array.from({ length: COMMENTS_COUNT }).map(() =>
      createComment({ author, article }),
    );

    render(renderWithAuthProvider(<CommentsList />, testUser), {
      router: { query: { slug: article.slug } },
    });

    await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
    await user.click(screen.getAllByTestId(DELETE_BTN)[0]);

    expect(screen.getAllByTestId('comment')).toHaveLength(COMMENTS_COUNT - 1);
  });
});
