import { rest } from 'msw';

import { API_URL } from '../../config/config';
import db, { persistDb } from '../db';
import { authenticate, delayedResponse, hash } from '../serverUtils';

type RegisterBody = {
  user: {
    email: string;
    username: string;
    password: string;
  };
};

type LoginBody = {
  user: {
    email: string;
    password: string;
  };
};

export const userHandlers = [
  rest.post<RegisterBody>(`${API_URL}/users`, (req, _res, ctx) => {
    const userData = req.body.user;
    // TODO: one query?
    const userWithEmail = db.user.findFirst({
      where: { email: { equals: userData.email } },
    });
    const userWithUsername = db.user.findFirst({
      where: { username: { equals: userData.username } },
    });

    if (userWithEmail || userWithUsername) {
      const errorMessage = 'has already been taken';
      const errors: Record<string, [string]> = {};
      if (userData.username === userWithUsername?.username) {
        errors['username'] = [errorMessage];
      }

      if (userData.email === userWithEmail?.email) {
        errors['email'] = [errorMessage];
      }

      return delayedResponse(
        ctx.status(422),
        ctx.json({
          errors,
        }),
      );
    }
    const passwordHash = hash(userData.password);

    db.user.create({
      ...userData,
      password: passwordHash,
      image:
        'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1246.jpg',
      bio: '',
    });

    persistDb('user');

    const autenticatedUser = authenticate({
      email: userData.email,
      password: userData.password,
    });

    return delayedResponse(ctx.status(200), ctx.json(autenticatedUser));
  }),

  rest.post<LoginBody>(`${API_URL}/users/login`, (req, res, ctx) => {
    try {
      const credentials = req.body.user;

      const autenticatedUser = authenticate(credentials);

      return delayedResponse(ctx.status(200), ctx.json(autenticatedUser));
    } catch (error) {
      return delayedResponse(
        ctx.status(403),
        ctx.json({
          errors: {
            'email or password': ['is invalid'],
          },
        }),
      );
    }
  }),
];
