import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getArticle } from '../../api';
import ArticleHeading from '../../components/Article/ArticleHeading';
import { useAuth } from '../../context/AuthContext';
import { Article as ArticleModel } from '../../types';
import { formatDate } from '../../utils';

interface ArticleProps {
  article: ArticleModel;
}

export default function Article({ article }: ArticleProps): JSX.Element {
  const { query, isReady } = useRouter();
  const { user } = useAuth();

  const { data, isLoading, isIdle, error } = useQuery(
    ['article', query?.slug],
    () => getArticle(query?.slug as string, user?.token),
    { enabled: isReady && Boolean(user), initialData: article },
  );

  if (isLoading || isIdle) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('TODO: article not found');
  }

  // console.log('response', data, isLoading, isIdle, isReady, user);

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

  return (
    <div className="article-page">
      {data && (
        <ArticleHeading
          authorUsername={author.username}
          authorImage={author.image}
          createdAt={formatDate(createdAt)}
          favoriteCount={favoritesCount}
          favorited={favorited}
          following={author.following}
          heading={title}
          slug={slug}
        />
      )}

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
          <div className="article-meta">
            <a href="profile.html">
              <img src="http://i.imgur.com/Qr71crq.jpg" />
            </a>
            <div className="info">
              <a href="" className="author">
                Eric Simons
              </a>
              <span className="date">January 20th</span>
            </div>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; Follow Eric Simons
            </button>
            &nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Post <span className="counter">(29)</span>
            </button>
          </div>
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
  try {
    const article = await getArticle(params.slug);

    return {
      props: { article },
    };
  } catch (error) {
    return {
      props: { error: 'error' },
    };
  }
}
