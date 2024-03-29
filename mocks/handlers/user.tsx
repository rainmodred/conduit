//TODO: fixme
/* eslint-disable */
//@ts-nocheck
import { rest } from 'msw';

import { LoginFormValues } from '../../components/LoginForm/LoginForm';
import { RegisterFormValues } from '../../components/RegisterForm/RegisterForm';
import { API_URL } from '../../config/config';
import db, { createUser, persistDb } from '../db';
import {
  authenticate,
  delayedResponse,
  requireAuth,
  sanitizeProfile,
} from '../serverUtils';

type RegisterBody = {
  user: RegisterFormValues;
};

type LoginBody = {
  user: LoginFormValues;
};

export const userHandlers = [
  rest.post<RegisterBody>(`${API_URL}/users`, async (req, _res, ctx) => {
    const { user } = await req.json();
    // OR is not supported
    // https://github.com/mswjs/data/issues/89

    const userWithEmail = db.user.findFirst({
      where: { email: { equals: user.email } },
    });
    const userWithUsername = db.user.findFirst({
      where: { username: { equals: user.username } },
    });
    if (userWithEmail || userWithUsername) {
      const errorMessage = 'has already been taken';
      const errors: Record<string, [string]> = {};
      if (user.username === userWithUsername?.username) {
        errors['username'] = [errorMessage];
      }
      if (user.email === userWithEmail?.email) {
        errors['email'] = [errorMessage];
      }
      return delayedResponse(
        ctx.status(422),
        ctx.json({
          errors,
        }),
      );
    }

    const { email, password } = createUser(user);

    persistDb('user');
    const authenticatedUser = authenticate({
      email,
      password,
    });

    return delayedResponse(ctx.status(200), ctx.json(authenticatedUser));
  }),

  rest.post<LoginBody>(`${API_URL}/users/login`, async (req, _res, ctx) => {
    try {
      const { user: credentials } = await req.json();
      const authenticatedUser = authenticate(credentials);

      return delayedResponse(ctx.status(200), ctx.json(authenticatedUser));
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

  //TODO: not implemented
  rest.get(`${API_URL}/user`, (_req, _res, ctx) => {
    throw Error('Not implemented');
  }),

  rest.put(`${API_URL}/user`, (_req, _res, ctx) => {
    throw Error('Not implemented');
  }),

  rest.post(`${API_URL}/profiles/:username/follow`, (req, _res, ctx) => {
    try {
      const user = requireAuth(req);
      const { username } = req.params as { username: string };
      const updatedUser = db.user.update({
        where: { username: { equals: username } },
        data: { followedBy: prev => [...prev, user] },
      });
      const sanitizedProfile = sanitizeProfile(updatedUser, {
        following: true,
      });
      persistDb('user');
      return delayedResponse(
        ctx.status(200),
        ctx.json({ profile: sanitizedProfile }),
      );
    } catch (error) {
      return delayedResponse(ctx.status(401), ctx.json(error));
    }
  }),

  rest.delete(`${API_URL}/profiles/:username/follow`, (req, _res, ctx) => {
    try {
      const user = requireAuth(req);
      const { username } = req.params as { username: string };
      const updatedUser = db.user.update({
        where: { username: { equals: username } },
        data: {
          followedBy: prev =>
            prev.filter(({ username }) => username !== user.username),
        },
      });
      const sanitizedProfile = sanitizeProfile(updatedUser, {
        following: false,
      });
      persistDb('user');
      return delayedResponse(
        ctx.status(200),
        ctx.json({ profile: sanitizedProfile }),
      );
    } catch (error) {
      return delayedResponse(ctx.status(401));
    }
  }),
];
