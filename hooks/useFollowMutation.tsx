import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';

import { followUser, unFollowUser } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Profile, Article } from '../utils/types';

export default function useFollowMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(
    ({ profile }: { profile: Profile; slug?: string }) =>
      profile.following
        ? unFollowUser(profile.username, user?.token as string)
        : followUser(profile.username, user?.token as string),
    {
      onMutate: async ({ profile, slug }) => {
        if (slug) {
          await queryClient.cancelQueries(QUERY_KEYS.articleDetail(slug));
          const previousValue = queryClient.getQueryData<Article>(
            QUERY_KEYS.articleDetail(slug),
          );

          if (previousValue) {
            queryClient.setQueryData<Article>(QUERY_KEYS.articleDetail(slug), {
              ...previousValue,
              author: {
                ...previousValue.author,
                following: !previousValue.author.following,
              },
            });
          }

          return { previousValue };
        } else {
          await queryClient.cancelQueries(QUERY_KEYS.profile(profile.username));
          const prevProfile = queryClient.getQueryData<Profile>(
            QUERY_KEYS.profile(profile.username),
          );

          if (prevProfile) {
            queryClient.setQueryData<Profile>(
              QUERY_KEYS.profile(profile.username),
              {
                ...prevProfile,
                following: !prevProfile.following,
              },
            );
          }

          return { prevProfile };
        }
      },
      onError: (_err, { profile, slug }, context) => {
        if (context?.previousValue) {
          if (slug) {
            queryClient.setQueryData<Article>(
              QUERY_KEYS.articleDetail(slug),
              context.previousValue,
            );
          }
        }
        if (context?.prevProfile) {
          queryClient.setQueryData<Profile>(
            QUERY_KEYS.profile(profile.username),
            context.prevProfile,
          );
        }
      },

      onSuccess: (data, { profile, slug }) => {
        if (slug) {
          queryClient.setQueryData<Article>(
            QUERY_KEYS.articleDetail(slug),
            oldData => {
              return {
                ...oldData!,
                author: { ...data },
              };
            },
          );
        }
        queryClient.setQueryData<Profile>(
          QUERY_KEYS.profile(profile.username),
          data,
        );

        queryClient.invalidateQueries(['articles', 'feed']);
      },
    },
  );
}
