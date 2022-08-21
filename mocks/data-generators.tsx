const { faker } = require('@faker-js/faker');
// import { faker } from '@faker-js/faker';

import { Comment } from '../utils/types';

export type Overrides = Record<string, unknown>;

faker.seed(42);
function buildUser(overrides?: Overrides) {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    bio: faker.random.words(),
    image: faker.internet.avatar(),
    followedBy: [],
    ...overrides,
  };
}

function buildArticle(overrides?: Overrides) {
  const title = faker.random.words();
  const createdAt = faker.date.past().toISOString();

  return {
    id: faker.datatype.uuid(),
    slug: title,
    title,
    description: faker.random.words(),
    body: faker.lorem.paragraphs(),
    createdAt,
    updatedAt: faker.date.between(createdAt, faker.date.recent()).toISOString(),
    favoritedBy: [],
    favoritesCount: 0,
    tagList: [],
    ...overrides,
  };
}

function buildTag(overrides?: Overrides) {
  return {
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    ...overrides,
  };
}

function buildComment(overrides?: Overrides): Omit<Comment, 'author'> {
  return {
    id: faker.datatype.uuid(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
    body: faker.lorem.lines(),
    ...overrides,
  };
}

export { buildUser, buildArticle, buildTag, buildComment };
