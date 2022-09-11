import { useRouter } from 'next/router';

import Avatar from '../Shared/Avatar/Avatar';
import EditButton from '../Shared/Buttons/EditButton/EditButton';
import FollowButton from '../Shared/Buttons/FollowButton/FollowButton';
import { useAuth } from '../../context/AuthContext';
import useFollowMutation from '../../hooks/useFollowMutation';
import useProfile from '../../hooks/useProfile';

export default function ProfileInfo() {
  const { query, push } = useRouter();

  const { user } = useAuth();
  const { username } = query as { username: string };
  const { profile } = useProfile(username, user?.token);

  const followMutation = useFollowMutation();

  function handleFollow() {
    if (!user) {
      push('/login');
      return;
    }
    if (profile) {
      followMutation.mutate({ profile });
    }
  }

  return (
    <div className="row">
      <div className="col-xs-12 col-md-10 offset-md-1">
        {!profile ? (
          <>
            <Avatar
              src={'fallback'}
              alt="user img"
              className="user-img"
              width="100"
              height="100"
            />
            <h4>Loading...</h4>
          </>
        ) : (
          <>
            <Avatar
              alt="user img"
              src={profile.image}
              className="user-img"
              width="100"
              height="100"
            />
            <h4>{profile?.username}</h4>
            <p>{profile?.bio}</p>

            {user?.username === username ? (
              <EditButton type="profile" />
            ) : (
              <FollowButton
                onClick={handleFollow}
                followed={profile?.following}
                disabled={false}
              >
                {username}
              </FollowButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
