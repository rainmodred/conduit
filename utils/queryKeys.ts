export const QUERY_KEYS = {
  feed: (page: number) => ['articles', 'feed', page] as const,
  articleDetail: (slug: string) => ['article', slug] as const,
};
