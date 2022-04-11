import { useQuery, UseQueryOptions } from 'react-query';
import { ArticlesFromAPi } from '../types';

export default function useFeed(
  fetcher: () => Promise<ArticlesFromAPi>,
  options?: UseQueryOptions<ArticlesFromAPi>,
) {
  return useQuery<ArticlesFromAPi>('feed', fetcher, options);
}
