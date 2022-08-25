import { useRouter } from 'next/router';
import { useMutation } from 'react-query';

import { useAuth } from '../context/AuthContext';
import { deleteArticle } from '../utils/api';

export function useDeleteArticleMutation(slug: string) {
  const { user } = useAuth();
  const { push } = useRouter();

  return useMutation(() => deleteArticle(slug, user?.token as string), {
    onMutate: () => {
      push('/');
    },
  });
}
