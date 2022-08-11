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

interface ArticleToCreate {
  title: string;
  description: string;
  body: string;
  taglist: string[];
}

interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
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
