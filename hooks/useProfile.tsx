import { useQuery } from 'react-query';

import { getProfile } from '../utils/api';
import { QUERY_KEYS } from '../utils/queryKeys';

export default function useProfile(username: string, token?: string) {
  const res = useQuery(
    QUERY_KEYS.profile(username),
    () => getProfile(username as string, token),
    {
      enabled: typeof username === 'string',
    },
  );

  return { profile: res.data, ...res };
}
