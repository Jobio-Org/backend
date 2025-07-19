import { faker } from '@faker-js/faker';

export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  role: faker.helpers.arrayElement(['authenticated', 'admin', 'user']),
  emailVerified: faker.datatype.boolean(),
  phoneVerified: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const createMockJwtUser = (overrides: Partial<any> = {}) => ({
  iss: faker.internet.url(),
  sub: faker.string.uuid(),
  aud: 'authenticated',
  email: faker.internet.email(),
  phone: faker.phone.number(),
  app_metadata: {
    provider: faker.helpers.arrayElement(['email', 'google', 'facebook']),
    providers: ['email'],
  },
  user_metadata: {
    email: faker.internet.email(),
    email_verified: faker.datatype.boolean(),
    phone_verified: faker.datatype.boolean(),
    sub: faker.string.uuid(),
  },
  role: 'authenticated',
  aal: 'aal1',
  amr: [
    {
      method: 'password',
      timestamp: faker.date.recent().getTime(),
    },
  ],
  session_id: faker.string.uuid(),
  is_anonymous: false,
  ...overrides,
});

export const createMockAppConfig = (overrides: Partial<any> = {}) => ({
  get: jest.fn((key: string) => {
    const config = {
      JWT_SECRET: faker.string.alphanumeric(64),
      SUPABASE_URL: faker.internet.url(),
      SUPABASE_SECRET_KEY: faker.string.alphanumeric(32),
      DATABASE_URL: faker.internet.url(),
      PORT: faker.number.int({ min: 3000, max: 9000 }),
      NODE_ENV: faker.helpers.arrayElement(['development', 'production', 'test']),
      ...overrides,
    };
    return config[key] || undefined;
  }),
});

export const createMockEmail = (overrides: Partial<any> = {}) => ({
  to: faker.internet.email(),
  from: faker.internet.email(),
  subject: faker.lorem.sentence(),
  text: faker.lorem.paragraphs(2),
  html: faker.lorem.paragraphs(2),
  attachments: faker.datatype.boolean() ? [faker.internet.url()] : [],
  sentAt: faker.date.past(),
  ...overrides,
});
