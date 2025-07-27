import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';
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
      DB_URL: process.env.DB_URL_TEST,
      JWT_SECRET: process.env.JWT_SECRET_TEST,
      SUPABASE_URL: process.env.SUPABASE_URL_TEST,
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY_TEST,
      CLIENT_AUTH_REDIRECT_URL: 'http://localhost:3000/auth/callback',
      CLIENT_INVITE_REDIRECT_URL: 'http://localhost:3000/invite',
      COMPANY_INVITATION_EXPIRE_TIME: '86400000',
      PORT: 3000,
      NODE_ENV: 'test',
      ...overrides,
    };
    return config[key] || undefined;
  }),
});

export const createMockSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL_TEST, process.env.SUPABASE_SECRET_KEY_TEST);
};

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
