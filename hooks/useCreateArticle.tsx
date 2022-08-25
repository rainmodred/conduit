import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import { useAuth } from '../context/AuthContext';
import { createArticle } from '../utils/api';
import { Article } from '../utils/types';
import { QUERY_KEYS } from '../utils/queryKeys';

export default function useCreateArticle() {
  const { push } = useRouter();

  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    (newArticle: {
      title: string;
      body: string;
      description: string;
      tagList: string[];
    }) => createArticle(newArticle, user?.token as string),
    {
      onSuccess: newArticle => {
        queryClient.setQueryData<Article>(
          QUERY_KEYS.articleDetail(newArticle?.slug),
          newArticle,
        );
        push(`/article/${newArticle.slug}`);
      },
    },
  );
}
