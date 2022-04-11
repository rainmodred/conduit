import { useQuery, UseQueryOptions } from 'react-query';
import { ArticlesFromAPi } from '../types';

export default function useArticles(
  fetcher: () => Promise<ArticlesFromAPi>,
  options?: UseQueryOptions<ArticlesFromAPi>,
) {
  return useQuery<ArticlesFromAPi>('articles', fetcher, options);
}
