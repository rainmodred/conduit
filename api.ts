import { User } from './types';

const apiUrl = 'https://api.realworld.io/api';

async function fetcher<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: T | null,
) {
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
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
  return fetcher('users', 'POST', data);
}

function signIn(email: string, password: string): Promise<{ user: User }> {
  const data = {
    user: {
      email,
      password,
    },
  };

  return fetcher('users/login', 'POST', data);
}

function getTags(): Promise<{ tags: string[] }> {
  return fetcher('tags');
}

export { apiUrl, signUp, signIn, getTags };
