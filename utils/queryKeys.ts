export const QUERY_KEYS = {
  profile: (username: string) => ['profile', username] as const,
  comments: (slug: string) => ['comments', slug] as const,
  feed: (page: number) => ['articles', 'feed', page] as const,
  articleDetail: (slug: string) => ['article', slug] as const,
};
