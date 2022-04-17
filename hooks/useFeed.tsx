import { useQuery, UseQueryOptions } from 'react-query';
import { getFeed } from '../api';
import { ArticlesFromAPi } from '../types';

export default function useFeed(
  token: string,
  options?: UseQueryOptions<ArticlesFromAPi>,
) {
  return useQuery<ArticlesFromAPi>('feed', () => getFeed(token), options);
}
