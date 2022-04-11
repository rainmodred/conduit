import { rest } from 'msw';
import { apiUrl } from '../api';

const defaultDefay = 200;
const loggedUser = {
  user: {
    email: 'conduitTest@example.com',
    username: 'conduitTest',
    bio: null,
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbmR1aXRUZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJjb25kdWl0VGVzdCIsImlhdCI6MTY0ODkwNzM1MywiZXhwIjoxNjU0MDkxMzUzfQ.tZxbSHR8BJg6WGXOy3keP8DrGCZByiwdXzdDZzj4--U',
  },
};

export const handlers = [
  rest.get(`${apiUrl}/articles`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(defaultDefay),
      ctx.json({
        articles: [
          {
            slug: 'Create-a-new-implementation-1',
            title: 'Create a new implementation',
            description: 'join the community by creating a new implementation',
            body: 'Share your knowledge and enpower the community by creating a new implementation',
            tagList: ['implementations'],
            createdAt: '2021-11-24T12:11:08.212Z',
            updatedAt: '2021-11-24T12:11:08.212Z',
            favorited: false,
            favoritesCount: 1604,
            author: {
              username: 'Gerome',
              bio: null,
              image: 'https://api.realworld.io/images/demo-avatar.png',
              following: false,
            },
          },
          {
            slug: 'Explore-implementations-1',
            title: 'Explore implementations',
            description:
              'discover the implementations created by the RealWorld community',
            body: 'Over 100 implementations have been created using various languages, libraries, and frameworks.\n\nExplore them on CodebaseShow.',
            tagList: ['codebaseShow', 'implementations'],
            createdAt: '2021-11-24T12:11:07.952Z',
            updatedAt: '2021-11-24T12:11:07.952Z',
            favorited: false,
            favoritesCount: 1034,
            author: {
              username: 'Gerome',
              bio: null,
              image: 'https://api.realworld.io/images/demo-avatar.png',
              following: false,
            },
          },
          {
            slug: 'Welcome-to-RealWorld-project-1',
            title: 'Welcome to RealWorld project',
            description:
              'Exemplary fullstack Medium.com clone powered by React, Angular, Node, Django, and many more',
            body: 'See how the exact same Medium.com clone (called Conduit) is built using different frontends and backends. Yes, you can mix and match them, because they all adhere to the same API spec',
            tagList: ['welcome', 'introduction'],
            createdAt: '2021-11-24T12:11:07.557Z',
            updatedAt: '2021-11-24T12:11:07.557Z',
            favorited: false,
            favoritesCount: 696,
            author: {
              username: 'Gerome',
              bio: null,
              image: 'https://api.realworld.io/images/demo-avatar.png',
              following: false,
            },
          },
        ],
        articlesCount: 3,
      }),
    );
  }),

  rest.get(`${apiUrl}/articles/feed`, (req, res, ctx) => {
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

    return res(ctx.status(200), ctx.json(loggedUser));
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

    return res(ctx.status(200), ctx.json(loggedUser));
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
