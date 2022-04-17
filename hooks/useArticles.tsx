import { useQuery, UseQueryOptions } from 'react-query';
import { getArticles, getFeed } from '../api';
import { Article, ArticlesFromAPi } from '../types';

// export default function useArticles(
//   fetcher: () => Promise<ArticlesFromAPi>,
//   options?: UseQueryOptions<ArticlesFromAPi>,
// ) {
//   return useQuery<Article[]>('articles', fetcher, {
//     ...options,
//     select: data => data.articles,
//   });
// }

export default function useArticles(page: string, { enabled = true }) {
  return useQuery<ArticlesFromAPi>(['articles', page], getArticles, {
    enabled,
  });
}
