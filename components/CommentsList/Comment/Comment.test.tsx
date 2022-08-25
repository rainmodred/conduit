import Comment from './Comment';
import { buildComment, buildUser } from '../../../mocks/data-generators';
import {
  renderWithAuthProvider,
  render,
  screen,
} from '../../../test/test-utils';

const DELETE_BTN = 'deleteComment';

describe('Comment', () => {
  it('should render', () => {
    const testComment = buildComment();
    const author = buildUser();

    render(
      renderWithAuthProvider(
        <Comment
          id={testComment.id}
          body={testComment.body}
          createdAt={testComment.createdAt}
          author={{
            username: author.username,
            bio: author.bio,
            following: false,
            image: author.image,
          }}
        />,
      ),
    );

    expect(screen.getByText(testComment.body)).toBeInTheDocument();
    expect(screen.getByText(author.username)).toBeInTheDocument();
    expect(screen.getByText(testComment.createdAt)).toBeInTheDocument();
    expect(screen.queryByTestId(DELETE_BTN)).not.toBeInTheDocument();
  });
});
