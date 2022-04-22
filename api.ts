import { ArticlesFromAPi, User } from './types';

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
    const response = await fetch(`${apiUrl}${endpoint}`, config);

    if (response.status === 401) {
      window.localStorage.removeItem('auth');
      // TODO: logout
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

function getTags(): Promise<{ tags: string[] }> {
  return fetcher('/tags');
}

function getArticles(
  page = 1,
  token?: string | null,
  params?: Record<string, string>,
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

  if (token) {
    return fetcher(`/articles/feed?${searchParams}`, { token });
  }

  return fetcher(`/articles?${searchParams}`);
}

export { apiUrl, signUp, signIn, getTags, getArticles };
