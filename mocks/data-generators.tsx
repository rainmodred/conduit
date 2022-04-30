import faker from '@faker-js/faker';

type Overrides = Record<string, unknown>;

function buildUser(overrides?: Overrides) {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    bio: faker.random.words(),
    image: faker.internet.avatar(),
    // articles: [],
    // favoritedArticles: [],
    // followedBy: [],
    ...overrides,
  };
}

export { buildUser };
