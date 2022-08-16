import { JWT_SECRET } from '../config/config';
import db, { ArticleDB, UserDB } from './db';
import jwt from 'jsonwebtoken';
import { createResponseComposition, context, RestRequest } from 'msw';
import { Overrides } from './data-generators';
import { Article, Profile, User } from '../utils/types';

const isTesting = process.env.NODE_ENV === 'test';

export const delayedResponse = createResponseComposition(undefined, [
  context.delay(isTesting ? 0 : 1000),
]);

function hash(str: string) {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

function sanitizeUser(user: UserDB): User {
  const { id, password, favoritedArticles, followedBy, articles, ...rest } =
    user;

  return rest;
}

function sanitizeProfile(user: UserDB, overrides?: Overrides): Profile {
  const {
    id,
    email,
    password,
    favoritedArticles,
    followedBy,
    articles,
    ...rest
  } = user;

  return {
    ...rest,
    following: false,
    ...overrides,
  };
}

function sanitizeArticle(article: ArticleDB, overrides?: Overrides): Article {
  const { id, tagList, favoritedBy, author, ...rest } = article;

  return {
    ...rest,
    favorited: false,
    author: sanitizeProfile(author),
    tagList: tagList.map(({ name }) => name),
    ...overrides,
  };
}

function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (user?.password === hash(password)) {
    const sanitizedUser = sanitizeUser(user);
    const token = jwt.sign({ ...sanitizedUser, id: user.id }, JWT_SECRET);

    return { user: { ...sanitizedUser, token } };
  }

  const error = new Error('Invalid username or password');
  throw error;
}

function requireAuth(req: RestRequest) {
  try {
    const encodedToken = req.headers.get('Authorization')?.slice(7);
    if (!encodedToken) {
      throw new Error('No authorization token provided!');
    }
    const decodedToken = jwt.verify(encodedToken, JWT_SECRET) as { id: string };
    const user = db.user.findFirst({
      where: {
        id: {
          equals: decodedToken.id,
        },
      },
    });

    if (!user) {
      throw Error('Unauthorized');
    }

    return user;
  } catch (err) {
    console.log('err', err);
  }
}

export {
  hash,
  authenticate,
  sanitizeUser,
  requireAuth,
  sanitizeArticle,
  sanitizeProfile,
};
