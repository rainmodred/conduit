import { JWT_SECRET } from '../config/config';
import db from './db';
import jwt from 'jsonwebtoken';
import { createResponseComposition, context } from 'msw';

//TODO
const isTesting = process.env.NODE_ENV === 'test';

console.log('is TESTING', isTesting);

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

function sanitizeUser(user: any) {
  const { password, favoritedArticles, followedBy, articles, ...rest } = user;

  return rest;
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
    const token = jwt.sign(sanitizedUser, JWT_SECRET);
    return { user: { ...sanitizedUser, token } };
  }

  const error = new Error('Invalid username or password');
  throw error;
}

export { hash, authenticate, sanitizeUser };
