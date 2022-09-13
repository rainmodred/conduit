import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { useAuth } from '../context/AuthContext';
import { getArticles } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';

function createQueryKey(
  route: string,
  options: { username?: string; tag?: string; page: number },
) {
  const { username, page, tag } = options;

  if (route === '/all') {
    return QUERY_KEYS.all(page);
  }
  if (route === '/profile/[username]' && username) {
    return QUERY_KEYS.myArticles(username, page);
  }
  if (route === '/profile/[username]/favorites') {
    return QUERY_KEYS.favorites(page);
  }
  if (route === '/tag/[tag]' && tag) {
    return QUERY_KEYS.tag(tag, page);
  }

  return ['articles', 'default', 1] as readonly [string, string, number];
}

export default function useArticles(params?: Record<string, unknown>) {
  const { user } = useAuth();
  const { isReady, query, route } = useRouter();

  const page = Number(query?.page) || 1;

  const { username, tag } = query as { username: string; tag: string };
  const queryKey = createQueryKey(route, { username, tag, page });

  const { data, isError } = useQuery(
    queryKey,
    () => getArticles(page, user?.token, params),
    {
      enabled: isReady && Boolean(user || user === undefined),
    },
  );

  return { queryKey, data, isError };
}
