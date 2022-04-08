import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getTags } from '../api';
import Articles from '../components/Articles';

export default function Home() {
  const { asPath, query } = useRouter();
  const { tag } = query;
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    getTags().then(
      ({ tags }) => {
        setTags(tags);
      },
      error => console.error('error', error),
    );
  }, []);

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
                <li className="nav-item">
                  {/* TODO: Your Feed */}
                  <Link href="#">
                    <a className="nav-link disabled">Your Feed</a>
                  </Link>
                </li>
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
            <Articles />
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
