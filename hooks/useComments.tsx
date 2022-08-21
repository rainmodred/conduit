import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { getComments } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';

export default function useComments() {
  const { query, isReady } = useRouter();

  return useQuery(
    QUERY_KEYS.comments(query?.slug as string),
    () => getComments(query?.slug as string),
    { enabled: isReady },
  );
}
