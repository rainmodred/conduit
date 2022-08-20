import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';

import { followUser, unFollowUser } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Profile, Article } from '../utils/types';

export default function useFollowMutation(slug: string, author: Profile) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      author.following
        ? unFollowUser(author.username, user?.token as string)
        : followUser(author.username, user?.token as string),
    {
      onMutate: async () => {
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
      },
      onError: (err, variables, context) => {
        if (context?.previousValue) {
          queryClient.setQueryData<Article>(
            QUERY_KEYS.articleDetail(slug),
            context.previousValue,
          );
        }
      },

      onSuccess: data => {
        queryClient.setQueryData<Article>(
          QUERY_KEYS.articleDetail(slug),
          oldData => {
            return {
              ...oldData,
              author: { ...data.profile },
            };
          },
        );

        // queryClient.setQueryData<Article>(['article', 'feed', 1], oldData =>
        //   oldData?.map(article =>
        //     article.slug === slug
        //       ? { ...article, author: { ...data.profile } }
        //       : article,
        //   ),
        // );
        queryClient.invalidateQueries(QUERY_KEYS.feed(1));
      },
    },
  );
}
