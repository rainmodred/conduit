import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getArticles, getFeed } from '../api';
import Articles from '../components/Articles';
import FeedNavigation from '../components/FeedNavigation';
import Tags from '../components/Tags';
import { useAuth } from '../context/AuthContext';
import useArticles from '../hooks/useArticles';
import useFeed from '../hooks/useFeed';

export default function Home() {
  const { user } = useAuth();
  const { isReady, push, query } = useRouter();

  useEffect(() => {
    if (isReady && user != undefined) {
      if (user) {
        push({
          query: { feed: user.username },
        });
      } else if (!user) {
        push('/');
      }
    }

    // infinite rerender with push
  }, [user, isReady]);

  const {
    data: articlesData,
    error: articlesError,
    isLoading: isArticlesLoading,
  } = useArticles(getArticles, {
    enabled: isReady,
  });

  const {
    data: feedData,
    error: feedError,
    isLoading: isFeedLoading,
  } = useFeed(() => getFeed(user?.token as string), {
    enabled: Boolean(user) && isReady,
  });

  function renderArticles() {
    if (!isReady) {
      return <div className="article-preview">Loading articles...</div>;
    }

    if (articlesError || feedError) {
      //TODO
      return <p>Error</p>;
    }

    if (query?.feed && query.feed === user?.username) {
      if (isFeedLoading) {
        return <div className="article-preview">Loading articles...</div>;
      }

      return <Articles articles={feedData?.articles ?? []} />;
    }

    if (isArticlesLoading) {
      return <div className="article-preview">Loading articles...</div>;
    }

    return <Articles articles={articlesData?.articles ?? []} />;
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
