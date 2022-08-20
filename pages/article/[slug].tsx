import { dehydrate, QueryClient, useQuery } from 'react-query';

import ArticleControls from '../../components/Article/ArticleControls/ArticleControls';
import useArticle from '../../hooks/useArticle';
import { useDeleteMutation } from '../../hooks/useDeleteMutation';
import useFavoriteMutation from '../../hooks/useFavoriteMutation';
import useFollowMutation from '../../hooks/useFollowMutation';
import { getArticle } from '../../utils/api';
import { Article as ArticleModel } from '../../utils/types';

export default function Article(): JSX.Element {
  const { data, isLoading, isIdle, error } = useArticle();

  const {
    author,
    body,
    createdAt,
    description,
    favorited,
    favoritesCount,
    slug,
    tagList,
    title,
    updatedAt,
  } = data ?? ({} as ArticleModel);

  const followMutation = useFollowMutation(slug, author);
  const favoriteMutation = useFavoriteMutation(slug, favorited);
  const deleteMutation = useDeleteMutation(slug);

  function handleFollowClick() {
    followMutation.mutate();
  }

  function handleFavoriteClick() {
    favoriteMutation.mutate();
  }

  function handleDeleteArticle() {
    deleteMutation.mutate();
  }

  // TODO: add skeleton loading
  if (isLoading || isIdle) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('TODO: article not found');
  }

  const isDisabled =
    followMutation.isLoading ||
    favoriteMutation.isLoading ||
    deleteMutation.isLoading;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>

          <ArticleControls
            slug={slug}
            isDisabled={isDisabled}
            isFavorited={favorited}
            isFollowing={author.following}
            onDelete={handleDeleteArticle}
            onFavorite={handleFavoriteClick}
            onFollow={handleFollowClick}
            author={{
              username: author.username,
              bio: author.bio,
              following: false,
              image: author.image,
            }}
            createdAt={createdAt}
            favoritesCount={favoritesCount}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>
              Web development technologies have evolved at an incredible clip
              over the past few years.
            </p>
            <h2 id="introducing-ionic">Introducing RealWorld.</h2>
            <p>It's a great solution for learning how other frameworks work.</p>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleControls
            slug={slug}
            isDisabled={isDisabled}
            isFavorited={favorited}
            isFollowing={author.following}
            onDelete={handleDeleteArticle}
            onFavorite={handleFavoriteClick}
            onFollow={handleFollowClick}
            author={{
              username: author.username,
              bio: author.bio,
              following: false,
              image: author.image,
            }}
            createdAt={createdAt}
            favoritesCount={favoritesCount}
          />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows="3"
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="comment-author-img"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
                  <i className="ion-edit"></i>
                  <i className="ion-trash-a"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { slug: string };
}) {
  const queryClient = new QueryClient();
  const { slug } = params;

  await queryClient.prefetchQuery(['article', slug], () =>
    getArticle(slug as string),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
