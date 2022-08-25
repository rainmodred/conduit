interface Profile {
  username: string;
  bio: string | null;
  image: string;
  following: boolean;
}

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
  author: Profile;
}

interface ArticlesFromAPi {
  articles: Article[];
  articlesCount: number;
}

interface ArticleFromApi {
  article: Article;
}

interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string;
}

type ArticleToCreate = Pick<
  Article,
  'title' | 'description' | 'body' | 'tagList'
>;

interface Comment {
  id: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

type AuthErrors = {
  errors: Record<string, [string]>;
};
type FormattedAuthErrors = Record<string, { message: string }>;

export type {
  Article,
  User,
  ArticlesFromAPi,
  Profile,
  ArticleToCreate,
  Comment,
  ArticleFromApi,
  AuthErrors,
  FormattedAuthErrors,
};
