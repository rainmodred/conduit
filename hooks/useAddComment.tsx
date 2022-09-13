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
      onMutate: async newComment => {
        await queryClient.cancelQueries(QUERY_KEYS.comments(slug));

        const optimisticComment: Comment = {
          ...newComment,
          id: `${newComment.body.slice(0, 10)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            bio: user!.bio,
            following: false,
            image: user!.image,
            username: user!.username,
          },
        };
        const previousComments = queryClient.getQueryData<Comment[]>(
          QUERY_KEYS.comments(slug),
        );
        if (previousComments) {
          queryClient.setQueryData<Comment[]>(QUERY_KEYS.comments(slug), () => [
            ...previousComments,
            optimisticComment,
          ]);
        }

        return { optimisticComment };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData<Comment[]>(
          QUERY_KEYS.comments(slug),
          comments =>
            comments!.filter(
              comment => comment.id !== context?.optimisticComment.id,
            ),
        );
      },

      onSuccess: (newComment, _variables, context) => {
        queryClient.setQueryData<Comment[]>(
          QUERY_KEYS.comments(slug),
          comments =>
            comments!.map(comment =>
              comment.id === context?.optimisticComment.id
                ? newComment
                : comment,
            ),
        );
      },
    },
  );
}
