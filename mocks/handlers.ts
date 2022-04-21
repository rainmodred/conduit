import { rest } from 'msw';
import { apiUrl } from '../api';
import { mockUser } from './mock';
import { Article } from '../types';
import { mockArticles } from './mock';

const defaultDefay = 200;
const userData = {
  user: mockUser,
};

export const handlers = [
  rest.get(`${apiUrl}/articles`, (req, res, ctx) => {
    const offset = Number(req.url.searchParams.get('offset')) || 0;
    const limit = Number(req.url.searchParams.get('limit')) || 10;
    const tag = req.url.searchParams.get('tag');

    let articles: Article[] = [...mockArticles.articles];

    if (tag) {
      articles = articles.filter(article => article.tagList.includes(tag));
    }

    const data = {
      articles: articles.slice(offset, offset + limit),
      articlesCount: articles.length,
    };

    return res(ctx.status(200), ctx.delay(defaultDefay), ctx.json(data));
  }),

  rest.get(`${apiUrl}/articles/feed`, (req, res, ctx) => {
    const token = req.headers.get('Authorization')?.slice(7);
    if (!token || token !== userData.user.token) {
      return res(ctx.delay(defaultDefay), ctx.status(401));
    }

    return res(
      ctx.status(200),
      ctx.delay(defaultDefay),
      ctx.json({
        articles: [
          {
            slug: 'feed article',
            title: 'feed article',
            description: 'test',
            body: 'test test',
            tagList: ['test'],
            createdAt: '2021-11-24T12:11:08.212Z',
            updatedAt: '2021-11-24T12:11:08.212Z',
            favorited: false,
            favoritesCount: 1,
            author: {
              username: 'test',
              bio: null,
              image: 'https://api.realworld.io/images/demo-avatar.png',
              following: false,
            },
          },
        ],
        articlesCount: 1,
      }),
    );
  }),

  rest.post(`${apiUrl}/users`, (req, res, ctx) => {
    const { username, email } = req.body?.user;

    const errorMessage = 'has already been taken';
    const errors: Record<string, [string]> = {};
    if (username === 'error') {
      errors['username'] = [errorMessage];
    }
    if (email === 'error@example.com') {
      errors['email'] = [errorMessage];
    }

    if (Object.keys(errors).length > 0) {
      return res(
        ctx.status(422),
        ctx.json({
          errors,
        }),
      );
    }

    return res(ctx.status(200), ctx.json(userData));
  }),

  rest.post(`${apiUrl}/users/login`, (req, res, ctx) => {
    const { email, password } = req.body?.user;

    if (email === 'error@example.com' || password === 'error') {
      return res(
        ctx.status(403),
        ctx.json({
          errors: {
            'email or password': ['is invalid'],
          },
        }),
      );
    }

    return res(ctx.status(200), ctx.json(userData));
  }),

  rest.get(`${apiUrl}/tags`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tags: ['welcome', 'implementations', 'codebaseShow', 'introduction'],
      }),
    );
  }),
];
