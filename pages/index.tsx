import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { getArticles, getFeed } from '../api';
import Articles from '../components/Articles';
import FeedNavigation from '../components/FeedNavigation';
import Tags from '../components/Tags';
import { useAuth } from '../context/AuthContext';
import useArticles from '../hooks/useArticles';
import useFeed from '../hooks/useFeed';
import { Article } from '../types';

export default function Home() {
  const { user } = useAuth();
  const { asPath, isReady, push } = useRouter();

  useEffect(() => {
    if (user) {
      push({
        query: { feed: user.username },
      });
    }

    if (!user && isReady) {
      push('/');
    }
    // infinite rerender with push
  }, [user]);

  const {
    data: articlesData,
    error: articlesError,
    isLoading: isArticlesLoading,
    isSuccess: isArticlesSuccess,
    status,
  } = useArticles(getArticles, {
    enabled: isReady,
  });

  const {
    data: feedData,
    error: feedError,
    isLoading: isFeedLoading,
    isSuccess: isFeedSuccess,
  } = useFeed(() => getFeed(user?.token as string), {
    enabled: Boolean(user) && isReady,
  });

  const ifSomethingLoading = isArticlesLoading || isFeedLoading;
  console.log('STATUS', status, articlesData);

  let articles: Article[] = [];
  let feed: Article[] = [];

  function renderArticles() {
    if (ifSomethingLoading) {
      return <div className="article-preview">Loading articles...</div>;
    }

    if (articlesError) {
      return <p>Error {articlesError}</p>;
    }

    if (feedError) {
      return <p>Error {feedError}</p>;
    }

    if (isArticlesSuccess) {
      articles = articlesData?.articles;
    }

    if (isFeedSuccess) {
      feed = feedData?.articles;
    }

    return asPath.startsWith('/?feed') ? (
      <Articles articles={feed} />
    ) : (
      <Articles articles={articles} />
    );
  }

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedNavigation />
            {renderArticles()}
          </div>
          <div className="col-md-3">
            <Tags />
          </div>
        </div>
      </div>
    </div>
  );
}
