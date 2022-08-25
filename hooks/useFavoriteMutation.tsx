import { useMutation, useQueryClient } from 'react-query';

import { useAuth } from '../context/AuthContext';
import { favoriteArticle, unfavoriteArticle } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Article } from '../utils/types';

export default function useFavoriteMutation(slug: string, favorited: boolean) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      favorited
        ? unfavoriteArticle(slug, user?.token as string)
        : favoriteArticle(slug, user?.token as string),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(QUERY_KEYS.articleDetail(slug));
        const previousValue = queryClient.getQueryData<Article>(
          QUERY_KEYS.articleDetail(slug),
        );

        let favoritesCount = 0;
        if (previousValue && Number.isInteger(previousValue?.favoritesCount)) {
          favoritesCount = favorited
            ? previousValue.favoritesCount - 1
            : previousValue.favoritesCount + 1;
        }

        if (previousValue) {
          queryClient.setQueryData<Article>(QUERY_KEYS.articleDetail(slug), {
            ...previousValue,
            favorited: !previousValue.favorited,
            favoritesCount,
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
        queryClient.setQueryData<Article>(QUERY_KEYS.articleDetail(slug), data);
      },
    },
  );
}
