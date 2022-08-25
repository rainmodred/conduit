import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { useAuth } from '../context/AuthContext';
import { getArticle } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';

export default function useArticle() {
  const { query, isReady } = useRouter();
  const { user } = useAuth();
  return useQuery(
    QUERY_KEYS.articleDetail(query?.slug as string),
    () => getArticle(query?.slug as string, user?.token),
    { enabled: isReady && Boolean(user || user == undefined) },
  );
}
