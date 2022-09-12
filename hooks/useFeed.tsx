import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { useAuth } from '../context/AuthContext';
import { getFeed } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';

export default function useFeed() {
  const { user } = useAuth();
  const { isReady, push, query } = useRouter();

  const page = Number(query?.page) || 1;
  const queryKey = QUERY_KEYS.feed(page);

  const { data, isError } = useQuery(
    queryKey,
    () => getFeed(page, user?.token),
    {
      enabled: isReady && Boolean(user || user === undefined),
    },
  );

  useEffect(() => {
    if (isReady && user === undefined) {
      push({ pathname: '/all' });
    }

    // infinite rerender with push
  }, [user, isReady]);

  return { queryKey, data, isError };
}
