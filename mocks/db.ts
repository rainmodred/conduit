//TODO: fixme
/* eslint-disable */
//@ts-nocheck
import {
  factory,
  primaryKey,
  oneOf,
  manyOf,
  nullable,
  ENTITY_TYPE,
  PRIMARY_KEY,
} from '@mswjs/data';

import {
  buildArticle,
  buildComment,
  buildTag,
  buildUser,
  Overrides,
} from './data-generators';
import { hash } from './serverUtils';

function createDB() {
  return factory({
    user: {
      id: primaryKey(String),
      username: String,
      password: String,
      email: String,
      bio: nullable(String),
      image: String,
      followedBy: manyOf('user'),
    },

    article: {
      id: primaryKey(String),
      slug: String,
      title: String,
      description: String,
      body: String,
      tagList: manyOf('tag'),
      createdAt: Date,
      updatedAt: Date,
      favoritedBy: manyOf('user'),
      favoritesCount: Number,
      author: oneOf('user'),
    },

    tag: {
      id: primaryKey(String),
      name: String,
    },

    comment: {
      id: primaryKey(String),
      createdAt: Date,
      updatedAt: Date,
      body: String,
      author: oneOf('user'),
      article: oneOf('article'),
    },
  });
}

const db = createDB();

export type DB = ReturnType<typeof createDB>;
//https://github.com/mswjs/data/issues/185#issuecomment-1059022389
/** Helper to get the schema of an model. */
type Value<Key extends keyof DB> = Omit<
  ReturnType<DB[Key]['create']>,
  typeof ENTITY_TYPE | typeof PRIMARY_KEY
>;

export type UserDB = Value<'user'>;
export type ArticleDB = Value<'article'>;
export type TagDB = Value<'tag'>;
export type CommentDB = Value<'comment'>;

// TODO: better types
export function createUser(overrides?: Overrides) {
  const user = buildUser(overrides);

  if (overrides?.followedBy?.length > 0) {
    const followers = overrides.followedBy.map(follower =>
      db.user.findFirst({ where: { id: { equals: follower.id } } }),
    );

    db.user.create({
      ...user,
      password: hash(user.password),
      followedBy: followers,
    });
    return {
      ...user,
      ...overrides,
    };
  }

  db.user.create({
    ...user,
    password: hash(user.password),
  });
  return user;
}

export function createTag(overrides?: Overrides) {
  const tag = buildTag(overrides);

  db.tag.create(buildTag(overrides));
  return tag;
}

export function createArticle(overrides?: Overrides) {
  const tag = db.tag.create(buildTag());
  //TODO: fix if use don't exists
  const author = overrides?.author
    ? db.user.findFirst({ where: { id: { equals: overrides.author.id } } })!
    : createUser();
  const article = buildArticle(overrides);
  db.article.create({
    ...article,
    tagList: [tag],
    author,
  });

  return article;
}

export function createComment(overrides?: Overrides) {
  const comment = buildComment(overrides);
  const author = db.user.findFirst({
    where: { id: { equals: overrides?.author.id } },
  })!;
  const article = db.article.findFirst({
    where: { id: { equals: overrides?.article.id } },
  });

  if (!author || !article) {
    throw new Error('Author or Article not found');
  }

  db.comment.create({
    ...comment,
    author,
    article,
  });

  return comment;
}

function initFake() {
  const user = createUser({
    email: 'jerry@example.com',
    username: 'jerry',
    password: '1234',
  });
  const author = createUser({
    email: 'tom@example.com',
    username: 'tom',
    password: '1234',
  });

  const initialArticle = createArticle({
    author,
  });
  const ARTICLES_COUNT = 2;
  for (let i = 0; i < ARTICLES_COUNT; i++) {
    createArticle({
      author,
    });
  }

  const COMMENTS_COUNT = 5;
  for (let i = 0; i < COMMENTS_COUNT; i++) {
    createComment({ author: user, article: initialArticle });
  }

  persistDb('user');
  persistDb('article');
  persistDb('tag');
  persistDb('comment');
}

export type Model = keyof typeof db;

export const loadDb = () =>
  Object.assign(JSON.parse(window.localStorage.getItem('msw-db') || '{}'));

export const persistDb = (model: Model) => {
  if (process.env.NODE_ENV === 'test' || typeof window === 'undefined') return;
  const data = loadDb();
  data[model] = db[model].getAll();

  window.localStorage.setItem('msw-db', JSON.stringify(data));
};

export const initializeDb = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const database = loadDb();

  if (Object.keys(database).length === 0) {
    initFake();
    return;
  }

  Object.entries(db).forEach(([key, model]) => {
    const dataEntres = database[key];

    if (dataEntres) {
      if (key === 'tag') {
        dataEntres.forEach((entry: TagDB) => {
          const existingTag = db.tag.findFirst({
            where: { id: { equals: entry.id } },
          });

          if (!existingTag) {
            model.create(entry);
          }
        });
      }

      if (key === 'user') {
        const updatedFollowers: Array<[string, string[]]> = [];
        dataEntres.forEach((entry: UserDB) => {
          const { followedBy, ...rest } = entry;
          const currentUser = model.create({ ...rest, followedBy: [] });
          if (entry.followedBy.length > 0) {
            const followers = followedBy.map(follower => follower.id);
            updatedFollowers.push([currentUser.id, followers]);
          }
        });

        updatedFollowers.forEach(([currentUserId, followers]) => {
          followers.forEach(followerId => {
            const follower = db.user.findFirst({
              where: { id: { equals: followerId } },
            })!;

            db.user.update({
              where: { id: { equals: currentUserId } },
              data: {
                followedBy: prev => [...prev, follower],
              },
            });
          });
        });
      }

      if (key === 'article') {
        dataEntres.forEach((entry: ArticleDB) => {
          const {
            favoritedBy: favoritedByRef,
            author: authorRef,
            tagList: tagListRef,
            ...rest
          } = entry;
          const author = db.user.findFirst({
            where: { id: { equals: authorRef!.id } },
          })!;
          const favoritedBy = favoritedByRef.map(
            user =>
              db.user.findFirst({
                where: { id: { equals: user.id } },
              })!,
          );
          const tagList = tagListRef.map(tag => {
            const existingTag = db.tag.findFirst({
              where: { id: { equals: tag.id } },
            });
            if (existingTag) {
              return existingTag;
            }
            return db.tag.create({ id: tag.id, name: tag.name });
          });
          // loadcomments
          model.create({
            ...rest,
            favoritedBy,
            tagList,
            author,
          });
        });
      }
      if (key === 'comment') {
        dataEntres.forEach((entry: CommentDB) => {
          const { author: authorRef, article: articleRef, ...rest } = entry;

          const author = db.user.findFirst({
            where: { id: { equals: authorRef.id } },
          })!;
          const article = db.article.findFirst({
            where: { id: { equals: articleRef.id } },
          });

          const comment = db.comment.findFirst({
            where: { id: { equals: entry.id } },
          });

          if (!comment) {
            model.create({ ...rest, author, article });
          }
        });
      }
    }
  });
};

export const resetDb = () => {
  window.localStorage.clear();
};

initializeDb();

export default db;
