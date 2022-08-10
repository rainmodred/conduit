import { API_URL } from '../config/config';
import {
  Article,
  ArticlesFromAPi,
  ArticleToCreate,
  Profile,
  User,
} from './types';

async function fetcher(
  endpoint: string,
  {
    data,
    token,
    headers: customHeaders,
    ...customConfig
  }: { data?: unknown; token?: string } & RequestInit = {},
) {
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
      console.log('401');
      // window.localStorage.removeItem('auth');
      // TODO: logout
      // window.location = '/';
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

function updateUser(user: User): Promise<{ user: User }> {
  return fetcher('/user', { data: { user }, method: 'PUT' });
}

function getTags(): Promise<{ tags: string[] }> {
  return fetcher('/tags');
}

function getArticles(
  page = 1,
  token?: string,
  params?: Record<string, string>,
): Promise<ArticlesFromAPi> {
  //TODO: change to number
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

  return fetcher(`/articles?${searchParams}`, { token });
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

function getProfile(username: string): Promise<{ profile: Profile }> {
  return fetcher(`/profiles/${username}`);
}

function followUser(
  username: string,
  token: string,
): Promise<{ profile: Profile }> {
  return fetcher(`/profiles/${username}/follow`, { method: 'POST', token });
}

function unFollowUser(username: string, token: string) {
  return fetcher(`/profiles/${username}/follow`, { method: 'DELETE', token });
}

function createArticle(article: ArticleToCreate, token: string) {
  return fetcher('/articles', { data: { article }, token });
}

function getArticle(slug: string, token?: string): Promise<Article> {
  return fetcher(`/articles/${slug}`, { token }).then(data => data.article);
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

function getComments(
  slug: string,
  token?: string,
): Promise<{ comments: Comment[] }> {
  return fetcher(`/articles/${slug}/comments`, { token });
}

function createComment(
  slug: string,
  comment: { body: string },
  token: string,
): Promise<{ comment: Comment }> {
  return fetcher(`/articles/${slug}/comments`, { data: { comment }, token });
}

function deleteComment(slug: string, commentId: number, token: string) {
  return fetcher(`/articles/${slug}/comments/${commentId}`, {
    method: 'DELETE',
    token,
  });
}

function favoriteArticle(
  slug: string,
  token: string,
): Promise<{ article: Article }> {
  return fetcher(`/articles/${slug}/favorite`, { method: 'POST', token });
}

function unfavoriteArticle(slug: string, token: string) {
  return fetcher(`/articles/${slug}/favorite`, { method: 'DELETE', token });
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
  createComment,
  deleteComment,
  favoriteArticle,
  unfavoriteArticle,
};
