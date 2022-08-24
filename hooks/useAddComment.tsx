import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import { useAuth } from '../context/AuthContext';
import { addComment } from '../utils/api';
import { Comment } from '../utils/types';
import { QUERY_KEYS } from '../utils/queryKeys';

export function useAddComment() {
  const { query } = useRouter();
  const { slug } = query as { slug: string };

  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    (newComment: { body: string }) =>
      addComment(slug, newComment, user?.token as string),
    {
      onMutate: async => {
        // await queryClient.cancelQueries(QUERY_KEYS.comments(slug));
        // const previousComments = queryClient.getQueryData<Comment[]>(
        //   QUERY_KEYS.comments(slug),
        // );
        // queryClient.setQueryData<Comment[]>(
        //   QUERY_KEYS.comments(slug),
        //   comments => [...comments, newComment],
        // );
        //
        // return { previousComments };
      },
      onError: (_err, _variables, context) => {
        // if (context?.previousComments) {
        //   queryClient.setQueryData<Comment[]>(
        //     QUERY_KEYS.comments(slug),
        //     context.previousComments,
        //   );
        // }
      },

      onSuccess: newComment => {
        queryClient.setQueryData<Comment[]>(
          QUERY_KEYS.comments(slug),
          comments => [...comments, newComment],
        );
      },
    },
  );
}
