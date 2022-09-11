import Head from 'next/head';
import { useRouter } from 'next/router';

import Articles from '../../../components/Articles/Articles';
import FeedNavigation from '../../../components/FeedNavigation';
import ProfileInfo from '../../../components/ProfileInfo/ProfileInfo';

export default function Favorites() {
  const { query } = useRouter();
  const { username } = query as { username: string };

  return (
    <>
      <Head>
        <title>@{username}</title>
      </Head>
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <ProfileInfo />
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <FeedNavigation
                routes={[
                  {
                    path: `/profile/${username}`,
                    title: 'My Articles',
                    protected: false,
                  },
                  {
                    path: `/profile/${username}/favorites`,
                    title: 'Favorited Articles',
                    protected: false,
                  },
                ]}
                className="articles-toggle"
              />
              <Articles favorited={username} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
