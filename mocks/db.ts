import { factory, primaryKey, oneOf, manyOf, nullable } from '@mswjs/data';

const db = factory({
  user: {
    username: primaryKey(String),
    password: String,
    email: String,
    bio: nullable(String),
    image: String,
    followedBy: manyOf('user'),
    articles: manyOf('article'),
    favoritedArticles: manyOf('article'),
  },

  article: {
    slug: primaryKey(String),
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
    name: primaryKey(String),
  },

  // comment: {
  //   id: primaryKey(Number),
  //   createdAt: Date,
  //   updatedAt: Date,
  //   body: String,
  //   author: oneOf('user'),
  // },
});

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
  Object.entries(db).forEach(([key, model]) => {
    const dataEntres = database[key];
    if (dataEntres) {
      dataEntres?.forEach((entry: Record<string, any>) => {
        model.create(entry);
      });
    }
  });
};

export const resetDb = () => {
  window.localStorage.clear();
};

initializeDb();

export default db;
