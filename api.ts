import { Article, ArticlesFromAPi, User } from './types';

const apiUrl = 'https://api.realworld.io/api';

async function fetcher(
  endpoint: string,
  {
    data,
    token,
    headers: customHeaders,
    ...customConfig
  }: { data?: unknown; token?: string } & RequestInit = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, config);

    if (response.status === 401) {
      window.localStorage.removeItem('auth');
      window.location = '/';
    }

    if (!response.ok) {
      const error = await response.json();
      console.log('error', error);
      return Promise.reject(error);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
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
  return fetcher('users', { data });
}

function signIn(email: string, password: string): Promise<{ user: User }> {
  const data = {
    user: {
      email,
      password,
    },
  };

  return fetcher('users/login', { data });
}

function getTags(): Promise<{ tags: string[] }> {
  return fetcher('tags');
}

function getFeed(token: string): Promise<ArticlesFromAPi> {
  return fetcher('articles/feed', { token });
}

function getArticles(): Promise<ArticlesFromAPi> {
  return fetcher('articles');
}

export { apiUrl, signUp, signIn, getTags, getFeed, getArticles };
