interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string;
    following: boolean;
  };
}

interface ArticlesFromAPi {
  articles: Article[];
  articlesCount: number;
}

interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string;
}

type ApiErrorsType = Record<string, string>;

export type { Article, User, ApiErrorsType, ArticlesFromAPi };
