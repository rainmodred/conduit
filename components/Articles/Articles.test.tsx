import { buildArticle, buildUser } from '../../mocks/data-generators';

import { render, renderWithAuthProvider, screen } from '../../test/test-utils';
import Articles from './Articles';

const author = buildUser();
const articles = Array.from({ length: 3 }).map(() => {
  const article = buildArticle();
  return {
    ...article,
    author: {
      username: author.username,
      bio: author.bio,
      image: author.image,
      following: true,
    },
    favorited: false,
  };
});

describe('Articles', () => {
  it('should render articles', () => {
    render(
      renderWithAuthProvider(
        <Articles isError={false} isLoading={false} articles={articles} />,
      ),
    );

    articles.map(article => {
      expect(screen.getByText(article.title)).toBeInTheDocument();
    });
  });

  it('should show error message', () => {
    render(
      renderWithAuthProvider(
        <Articles isError={true} isLoading={false} articles={[]} />,
      ),
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should show loading message', () => {
    render(
      renderWithAuthProvider(
        <Articles isError={false} isLoading={true} articles={[]} />,
      ),
    );

    expect(screen.getByText('Loading articles...')).toBeInTheDocument();
  });
});
