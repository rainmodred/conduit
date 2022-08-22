import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import { useAuth } from '../context/AuthContext';
import { deleteComment } from '../utils/api';
import { Comment } from '../utils/types';
import { QUERY_KEYS } from '../utils/queryKeys';

export function useDeleteCommentMutation(commentId: string) {
  const { query } = useRouter();
  const { slug } = query as { slug: string };

  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    () => deleteComment(slug, commentId, user?.token as string),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(QUERY_KEYS.comments(slug));
        const previousComments = queryClient.getQueryData<Comment[]>(
          QUERY_KEYS.comments(slug),
        );
        queryClient.setQueryData<Comment[]>(QUERY_KEYS.comments(slug), old =>
          old?.filter(c => c.id !== commentId),
        );

        return { previousComments };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousComments) {
          queryClient.setQueryData<Comment[]>(
            QUERY_KEYS.comments(slug),
            context.previousComments,
          );
        }
      },

      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.comments(slug));
      },
    },
  );
}
