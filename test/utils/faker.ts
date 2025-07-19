import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

export const createMockJwtUser = (overrides: Partial<any> = {}) => ({
  iss: 'https://example.supabase.co',
  sub: faker.string.uuid(),
  aud: 'authenticated',
  email: faker.internet.email(),
  phone: faker.phone.number(),
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    email: faker.internet.email(),
    email_verified: true,
    phone_verified: false,
    sub: faker.string.uuid(),
  },
  role: 'authenticated',
  aal: 'aal1',
  amr: [
    {
      method: 'password',
      timestamp: Date.now(),
    },
  ],
  session_id: faker.string.uuid(),
  is_anonymous: false,
  ...overrides,
});

// Configuration
export const createMockAppConfig = (overrides: Partial<any> = {}) => ({
  get: jest.fn((key: string) => {
    const config = {
      JWT_SECRET: randomBytes(64).toString('base64'),
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SECRET_KEY: 'test-secret-key',
      CLIENT_AUTH_REDIRECT_URL: 'http://localhost:3000/auth/callback',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      PORT: 3000,
      NODE_ENV: 'test',
      ...overrides,
    };
    return config[key] || undefined;
  }),
});

// Email
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

export const createMockSqlInjectionData = () => "'; DROP TABLE public.user_details; --";

export const createMockXssData = () => "'<script>alert('xss')</script>@example.com'";

// Test helpers
export const createMockTestController = () => ({
  getUserSpy: jest.fn(),
  getUserIdSpy: jest.fn(),
});

export const createMockJwtToken = (user: any, secret: string, options: any = {}) => {
  return sign(user, secret, { algorithm: 'HS256', expiresIn: 10000, ...options });
};

export const createMockInvalidJwtToken = (user: any, wrongSecret: string = 'wrong-secret') => {
  return sign(user, wrongSecret, { algorithm: 'HS256' });
};

export const createMockExpiredJwtToken = (user: any, secret: string) => {
  return sign(user, secret, { algorithm: 'HS256', expiresIn: 0 });
};
