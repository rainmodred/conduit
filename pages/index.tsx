import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getArticles, getFeed, getTags } from '../api';
import Articles from '../components/Articles';
import { useAuth } from '../context/AuthContext';
import { Article } from '../types';

export default function Home() {
  const { user } = useAuth();
  const { asPath, query } = useRouter();
  const { tag } = query;
  const [tags, setTags] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);

  useEffect(() => {
    getTags().then(
      ({ tags }) => {
        setTags(tags);
      },
      error => console.error('error', error),
    );

    if (user) {
      getFeed(user.token).then(
        ({ articles }) => {
          setArticles(articles);
          setIsArticlesLoading(false);
        },
        error => {
          console.error('error', error);
          setIsArticlesLoading(false);
        },
      );
    } else {
      getArticles().then(
        ({ articles }) => {
          setArticles(articles);
          setIsArticlesLoading(false);
        },
        error => {
          console.error('error', error);
          setIsArticlesLoading(false);
        },
      );
    }
  }, [user]);

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
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {user && (
                  <li className="nav-item">
                    <Link href={`?feed=${user.username}`}>
                      <a
                        className={`nav-link ${
                          asPath === `/?feed=${user.username}` ? 'active' : ''
                        } `}
                      >
                        Your Feed
                      </a>
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link href="/">
                    <a className={`nav-link ${asPath === '/' ? 'active' : ''}`}>
                      Global Feed
                    </a>
                  </Link>
                </li>
                {tag && (
                  <li className="nav-item">
                    <Link href={`?tag=${tag}`}>
                      <a className="nav-link active"># {tag}</a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            {isArticlesLoading ? (
              <p>Loading...</p>
            ) : (
              <Articles articles={articles} />
            )}
          </div>
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags.map(tag => (
                  <Link href={`?tag=${tag}`} key={`tag-${tag}`}>
                    <a className="tag-pill tag-default">{tag}</a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
