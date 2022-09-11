import Head from 'next/head';
import Link from 'next/link';
import AddCommentForm from '../../components/AddCommentForm/AddCommentForm';
import ReactMarkdown from 'react-markdown';

import ArticleControls from '../../components/Article/ArticleControls/ArticleControls';
import CommentsList from '../../components/CommentsList/CommentsList';
import { useAuth } from '../../context/AuthContext';
import useArticle from '../../hooks/useArticle';
import { useDeleteArticleMutation } from '../../hooks/useDeleteArticleMutation';
import useFavoriteMutation from '../../hooks/useFavoriteMutation';
import useFollowMutation from '../../hooks/useFollowMutation';
import { Article as ArticleModel } from '../../utils/types';

export default function Article(): JSX.Element {
  const { data } = useArticle();
  const { user } = useAuth();
  const { author, body, createdAt, favorited, favoritesCount, slug, title } =
    data ?? ({} as ArticleModel);

  const followMutation = useFollowMutation();
  const favoriteMutation = useFavoriteMutation(slug, favorited);
  const deleteArticleMutation = useDeleteArticleMutation(slug);

  function handleFollowClick() {
    followMutation.mutate({ profile: author, slug });
  }

  function handleFavoriteClick() {
    favoriteMutation.mutate();
  }

  function handleDeleteArticle() {
    deleteArticleMutation.mutate();
  }

  const isDisabled =
    followMutation.isLoading ||
    favoriteMutation.isLoading ||
    deleteArticleMutation.isLoading;

  return (
    <div className="article-page">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>

          <ArticleControls
            slug={slug}
            isDisabled={isDisabled}
            isFavorited={favorited}
            isFollowing={author?.following}
            onDelete={handleDeleteArticle}
            onFavorite={handleFavoriteClick}
            onFollow={handleFollowClick}
            author={{
              username: author?.username,
              bio: author?.bio,
              following: false,
              image: author?.image,
            }}
            createdAt={createdAt}
            favoritesCount={favoritesCount}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleControls
            slug={slug}
            isDisabled={isDisabled}
            isFavorited={favorited}
            isFollowing={author?.following}
            onDelete={handleDeleteArticle}
            onFavorite={handleFavoriteClick}
            onFollow={handleFollowClick}
            author={{
              username: author?.username,
              bio: author?.bio,
              following: false,
              image: author?.image,
            }}
            createdAt={createdAt}
            favoritesCount={favoritesCount}
          />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {user ? (
              <AddCommentForm />
            ) : (
              <p>
                <Link href="/login">
                  <a> Sign in </a>
                </Link>
                or
                <Link href="/register">
                  <a> sign up </a>
                </Link>
                to add comments on this article.
              </p>
            )}
            <CommentsList />
          </div>
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const queryClient = new QueryClient();
//   const { slug } = params;
//
//   await queryClient.prefetchQuery(
//     QUERY_KEYS.articleDetail(slug),
//     () => getArticle(slug as string),
//     { staleTime: 1000 * 60 * 5 },
//   );
//
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }
