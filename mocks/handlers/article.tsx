import { rest } from 'msw';
import jwt from 'jsonwebtoken';

import { API_URL, JWT_SECRET } from '../../config/config';
import { Article } from '../../utils/types';
import db, { persistDb } from '../db';
import {
  delayedResponse,
  requireAuth,
  sanitizeArticle,
  sanitizeComment,
  sanitizeProfile,
} from '../serverUtils';
import { buildArticle, buildComment, buildTag } from '../data-generators';

export const articleHandlers = [
  rest.get(`${API_URL}/articles`, (req, res, ctx) => {
    const offset = Number(req.url.searchParams.get('offset')) || 0;
    const limit = Number(req.url.searchParams.get('limit')) || 10;
    const tag = req.url.searchParams.get('tag');

    const author = Number(req.url.searchParams.get('author'));
    const favorited = Number(req.url.searchParams.get('favorited'));

    if (author || favorited) {
      //TODO: not implemented
    }

    const token = req.headers.get('Authorization')?.slice(7);

    let articlesCount = 0;
    let favoritedArticles: ReturnType<typeof db.article.getAll> = [];
    let paginatedArticles: ReturnType<typeof db.article.getAll> = [];
    if (tag) {
      const tagQuery = {
        where: { tagList: { name: { equals: tag } } },
        take: limit,
        skip: offset,
      };
      paginatedArticles = db.article.findMany(tagQuery);
      articlesCount = db.article.count({ where: tagQuery.where });
    } else {
      paginatedArticles = db.article.findMany({ take: limit, skip: offset });
      articlesCount = db.article.count();
    }

    if (token) {
      const decodedToken = jwt.verify(token, JWT_SECRET) as {
        id: string;
      };

      favoritedArticles = db.article.findMany({
        where: {
          favoritedBy: { id: { equals: decodedToken?.id } },
        },
      });
    }

    const sanitizedArticles = paginatedArticles.map(article => {
      const favorited = favoritedArticles.find(({ id }) => id === article.id)
        ? true
        : false;
      return sanitizeArticle(article, { favorited });
    });

    return delayedResponse(
      ctx.status(200),
      ctx.json({ articles: sanitizedArticles, articlesCount }),
    );
  }),

  rest.post(`${API_URL}/articles/`, async (req, _res, ctx) => {
    try {
      const user = requireAuth(req);
      const { article: articleData } = await req.json();

      const tagList = articleData.tagList.map(tagName => {
        const existingTag = db.tag.findFirst({
          where: { name: { equals: tagName } },
        });
        if (!existingTag) {
          return db.tag.create(buildTag({ name: tagName }));
        }
        return existingTag;
      });

      const article = db.article.create({
        ...buildArticle({
          slug: articleData.title,
          body: articleData.body,
          description: articleData.description,
          title: articleData.title,
        }),
        author: user,
        tagList,
      });

      persistDb('article');

      return delayedResponse(
        ctx.status(200),
        ctx.json({ article: sanitizeArticle(article) }),
      );
    } catch (error) {
      console.log('error', error);

      return delayedResponse(ctx.status(404));
    }
  }),

  rest.get(`${API_URL}/articles/feed`, (req, _res, ctx) => {
    try {
      const offset = Number(req.url.searchParams.get('offset')) || 0;
      const limit = Number(req.url.searchParams.get('limit')) || 10;
      const user = requireAuth(req);

      const dbQuery = {
        where: { author: { followedBy: { id: { equals: user?.id } } } },
        take: limit,
        skip: offset,
      };

      const paginatedArticles = db.article.findMany(dbQuery);

      const articlesCount = db.article.count({ where: dbQuery.where });
      const favoritedArticles = db.article.findMany({
        where: {
          favoritedBy: { id: { equals: user?.id } },
        },
      });

      const sanizitedArticles: Article[] = paginatedArticles.map(article => {
        const favorited = favoritedArticles.find(({ id }) => id === article.id)
          ? true
          : false;
        return sanitizeArticle(article, { favorited });
      });

      return delayedResponse(
        ctx.status(200),
        ctx.json({ articles: sanizitedArticles, articlesCount }),
      );
    } catch (error) {
      return delayedResponse(ctx.status(400));
    }
  }),

  rest.get(`${API_URL}/articles/:slug`, (req, _res, ctx) => {
    try {
      const { slug } = req.params as { slug: string };

      const article = db.article.findFirst({
        where: { slug: { equals: slug } },
      });

      if (!article) {
        return delayedResponse(
          ctx.status(422),
          ctx.json({ errors: { article: ['not found'] } }),
        );
      }

      const encodedToken = req.headers.get('Authorization')?.slice(7);
      if (!encodedToken) {
        return delayedResponse(
          ctx.status(200),
          ctx.json({
            article: sanitizeArticle(article, { favorited: false }),
          }),
        );
      }
      const decodedToken = jwt.verify(encodedToken, JWT_SECRET) as {
        id: string;
      };

      const favorited = article.favoritedBy?.find(
        ({ id }) => id === decodedToken?.id,
      )
        ? true
        : false;

      const following = !!db.user.findFirst({
        where: {
          username: { equals: article?.author?.username },
          followedBy: { id: { equals: decodedToken.id } },
        },
      });

      const sanitizedProfile = sanitizeProfile(article.author, { following });
      const sanitizedArticle = sanitizeArticle(article, {
        author: sanitizedProfile,
        favorited,
      });

      return delayedResponse(
        ctx.status(200),
        ctx.json({
          article: sanitizedArticle,
        }),
      );
    } catch (error) {
      delayedResponse(ctx.status(400));
    }
  }),

  rest.delete(`${API_URL}/articles/:slug`, (req, _res, ctx) => {
    try {
      const { slug } = req.params as { slug: string };
      requireAuth(req);
      db.article.delete({ where: { slug: { equals: slug } } });
      persistDb('article');
      return delayedResponse(ctx.status(204));
    } catch (error) {
      return delayedResponse(
        ctx.status(422),
        ctx.json({ errors: { article: ['not found'] } }),
      );
    }
  }),

  rest.post(`${API_URL}/articles/:slug/favorite`, (req, _res, ctx) => {
    try {
      const { slug } = req.params as { slug: string };
      const user = requireAuth(req);
      const article = db.article.update({
        where: { slug: { equals: slug } },
        data: {
          favoritedBy: prev => [...prev, user],
          favoritesCount: prev => prev + 1,
        },
      });

      persistDb('article');

      return delayedResponse(
        ctx.status(200),
        ctx.json(sanitizeArticle(article!, { favorited: true })),
      );
    } catch (error) {
      return delayedResponse(ctx.status(401));
    }
  }),

  rest.delete(`${API_URL}/articles/:slug/favorite`, (req, _res, ctx) => {
    try {
      const { slug } = req.params as { slug: string };
      const user = requireAuth(req);
      db.article.update({
        where: { slug: { equals: slug } },
        data: {
          favoritedBy: prev => prev.filter(({ id }) => id !== user.id),
          favoritesCount: prev => prev - 1,
        },
      });

      persistDb('article');
      return delayedResponse(ctx.status(204));

      // 422?
    } catch (error) {
      return delayedResponse(ctx.status(401));
    }
  }),

  rest.get(`${API_URL}/articles/:slug/comments`, (req, _res, ctx) => {
    const { slug } = req.params as { slug: string };
    const comments = db.comment.findMany({
      where: {
        article: {
          slug: { equals: slug },
        },
      },
    });

    const sanitizedComments = comments.map(comment => sanitizeComment(comment));

    return delayedResponse(
      ctx.status(200),
      ctx.json({ comments: sanitizedComments }),
    );
  }),

  rest.delete(
    `${API_URL}/articles/:slug/comments/:commentId`,
    (req, _res, ctx) => {
      try {
        const { commentId } = req.params as { commentId: string };
        requireAuth(req);
        db.comment.delete({ where: { id: { equals: commentId } } });
        persistDb('comment');
        return delayedResponse(ctx.status(204));
      } catch (error) {
        return delayedResponse(
          ctx.status(422),
          ctx.json({ errors: { comment: ['not found'] } }),
        );
      }
    },
  ),

  rest.post(`${API_URL}/articles/:slug/comments`, async (req, _res, ctx) => {
    try {
      const user = requireAuth(req);
      const { comment: commentData } = await req.json();

      const { slug } = req.params as { slug: string };

      const article = db.article.findFirst({
        where: { slug: { equals: slug } },
      });
      if (!article) {
        throw new Error('Article not found');
      }

      const comment = db.comment.create({
        ...buildComment({
          body: commentData.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        author: user,
        article,
      });

      persistDb('comment');

      return delayedResponse(
        ctx.status(200),
        ctx.json({ comment: sanitizeComment(comment) }),
      );
    } catch (error) {
      return delayedResponse(ctx.status(401));
    }
  }),

  rest.get(`${API_URL}/tags`, (_req, _res, ctx) => {
    const tags = db.tag.getAll().map(({ name }) => name);
    return delayedResponse(ctx.status(200), ctx.json({ tags }));
  }),
];
