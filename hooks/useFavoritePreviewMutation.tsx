import { useMutation, useQueryClient } from 'react-query';

import { useAuth } from '../context/AuthContext';
import { favoriteArticle, unfavoriteArticle } from '../utils/api';
import { Article, ArticlesFromAPi } from '../utils/types';

function onFavorite({ favorited, favoritesCount }: Article) {
  return (favoritesCount = favorited ? favoritesCount - 1 : favoritesCount + 1);
}

export default function useFavoritePreviewMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    ({
      queryKey,
      favorited,
      slug,
    }: {
      queryKey: readonly [string, string, number?];
      favorited: boolean;
      slug: string;
    }) => {
      return favorited
        ? unfavoriteArticle(slug, user?.token as string)
        : favoriteArticle(slug, user?.token as string);
    },

    {
      onMutate: async ({ queryKey, slug }) => {
        await queryClient.cancelQueries(queryKey);
        const previousArticles =
          queryClient.getQueryData<ArticlesFromAPi>(queryKey);
        queryClient.setQueryData<ArticlesFromAPi>(queryKey, oldData => ({
          articles: oldData!.articles.map((article, index) =>
            article.slug === slug
              ? {
                  ...article,
                  favoritesCount: onFavorite(article),
                  favorited: !previousArticles?.articles[index].favorited,
                }
              : article,
          ),
          articlesCount: oldData!.articlesCount,
        }));

        return { previousArticles };
      },
      onError: (_err, { queryKey }, context) => {
        if (context?.previousArticles) {
          queryClient.setQueryData<ArticlesFromAPi>(
            queryKey,
            context.previousArticles,
          );
        }
      },

      onSuccess: (data, { queryKey }) => {
        queryClient.setQueryData<ArticlesFromAPi>(queryKey, oldData => ({
          articles: oldData!.articles.map(article =>
            article.slug === data.slug ? data : article,
          ),
          articlesCount: oldData!.articlesCount,
        }));
      },
    },
  );
}
