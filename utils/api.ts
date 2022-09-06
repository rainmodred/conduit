import { API_URL } from '../config/config';
import {
  Article,
  ArticlesFromAPi,
  ArticleToCreate,
  Profile,
  User,
  Comment,
} from './types';
import { transformArticle, transformComment } from './utils';

async function fetcher<T>(
  endpoint: string,
  {
    data,
    token,
    headers: customHeaders,
    ...customConfig
  }: { data?: unknown; token?: string } & RequestInit = {},
): Promise<T> {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      window.localStorage.removeItem('auth');
      window.location = '/login';
    }

    if (response.status === 204) {
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      console.log('error', error);
      return Promise.reject(error);
    }

    const data = await response.json();
    // console.log('APIDATA', data);
    return data;
  } catch (error) {
    console.error('API REJECT', error);
    return Promise.reject(error);
  }
}

function signUp(
  email: string,
  username: string,
  password: string,
): Promise<{ user: User }> {
  const data = {
    user: {
      email,
      username,
      password,
    },
  };
  return fetcher('/users', { data });
}

function signIn(email: string, password: string): Promise<{ user: User }> {
  const data = {
    user: {
      email,
      password,
    },
  };

  return fetcher('/users/login', { data });
}

type UpdatedUser = Omit<User, 'token'> & { password: string };
function updateUser(user: UpdatedUser, token: string): Promise<User> {
  return fetcher<{ user: User }>('/user', {
    data: { user },
    method: 'PUT',
    token,
  }).then(data => data.user);
}

function getTags(): Promise<{ tags: string[] }> {
  return fetcher('/tags');
}

function getArticles(
  page = 1,
  token?: string,
  params?: Record<string, unknown>,
): Promise<ArticlesFromAPi> {
  const limit = '10';

  let offset = '0';
  if (page > 1) {
    offset = (Number(limit) * page - 10).toString();
  }

  const searchParams = new URLSearchParams({
    ...params,
    limit,
    offset,
  }).toString();

  return fetcher<ArticlesFromAPi>(`/articles?${searchParams}`, {
    token,
  }).then(data => ({
    articles: data.articles.map(transformArticle),
    articlesCount: data.articlesCount,
  }));
}

function getFeed(page = 1, token?: string, params?: Record<string, string>) {
  const limit = '10';

  let offset = '0';
  if (page > 1) {
    offset = (Number(limit) * page - 10).toString();
  }

  const searchParams = new URLSearchParams({
    ...params,
    limit,
    offset,
  }).toString();

  return fetcher(`/articles/feed?${searchParams}`, { token });
}

function getProfile(username: string, token?: string): Promise<Profile> {
  return fetcher<{ profile: Profile }>(`/profiles/${username}`, { token }).then(
    data => data.profile,
  );
}

function followUser(username: string, token: string): Promise<Profile> {
  return fetcher<{ profile: Profile }>(`/profiles/${username}/follow`, {
    method: 'POST',
    token,
  }).then(data => data.profile);
}

function unFollowUser(username: string, token: string): Promise<Profile> {
  return fetcher<{ profile: Profile }>(`/profiles/${username}/follow`, {
    method: 'DELETE',
    token,
  }).then(data => data.profile);
}

function createArticle(
  article: ArticleToCreate,
  token: string,
): Promise<Article> {
  return fetcher<{ article: Article }>('/articles/', {
    data: { article },
    token,
    method: 'POST',
  }).then(data => transformArticle(data.article));
}

function getArticle(slug: string, token?: string): Promise<Article> {
  return fetcher<{ article: Article }>(`/articles/${slug}`, { token }).then(
    data => transformArticle(data.article),
  );
}

function updateArticle(
  slug: string,
  article: ArticleToCreate,
  token: string,
): Promise<{ article: Article }> {
  return fetcher(`/articles/${slug}`, {
    method: 'PUT',
    data: { article },
    token,
  });
}

function deleteArticle(slug: string, token: string): Promise<unknown> {
  return fetcher(`/articles/${slug}`, { method: 'DELETE', token });
}

function getComments(slug: string): Promise<Comment[]> {
  return fetcher<{ comments: Comment[] }>(`/articles/${slug}/comments`).then(
    data => data.comments.map(transformComment),
  );
}

function addComment(
  slug: string,
  comment: { body: string },
  token: string,
): Promise<Comment> {
  return fetcher<{ comment: Comment }>(`/articles/${slug}/comments`, {
    data: { comment },
    token,
  }).then(data => transformComment(data.comment));
}

function deleteComment(
  slug: string | undefined,
  commentId: string,
  token: string,
) {
  if (!slug) {
    return Promise.reject();
  }
  return fetcher(`/articles/${slug}/comments/${commentId}`, {
    method: 'DELETE',
    token,
  });
}

function favoriteArticle(slug: string, token: string): Promise<Article> {
  return fetcher<{ article: Article }>(`/articles/${slug}/favorite`, {
    method: 'POST',
    token,
  }).then(data => data.article);
}

function unfavoriteArticle(slug: string, token: string): Promise<Article> {
  return fetcher<{ article: Article }>(`/articles/${slug}/favorite`, {
    method: 'DELETE',
    token,
  }).then(data => data.article);
}

export {
  API_URL,
  signUp,
  signIn,
  updateUser,
  getTags,
  getArticles,
  getFeed,
  getProfile,
  followUser,
  unFollowUser,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  getComments,
  addComment,
  deleteComment,
  favoriteArticle,
  unfavoriteArticle,
};
