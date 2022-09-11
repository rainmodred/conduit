export const QUERY_KEYS = {
  profile: (username: string) => ['profile', username] as const,
  comments: (slug: string) => ['comments', slug] as const,
  feed: (page: number) => ['articles', 'feed', page] as const,
  all: (page: number) => ['articles', 'all', page] as const,
  favorites: (page: number) => ['articles', 'favorites', page] as const,
  myArticles: (username: string, page: number) =>
    ['articles', username, page] as const,
  tag: (tag: string, page: number) => ['articles', tag, page] as const,
  articleDetail: (slug: string) => ['article', slug] as const,
};
