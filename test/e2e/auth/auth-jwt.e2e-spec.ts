import { faker } from '@faker-js/faker';
import { Controller, Get, INestApplication, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

import { CoreModule } from '~core/core.module';

import { AuthModule } from '~modules/auth/auth.module';
import { User } from '~modules/auth/domain/entities/user.entity';
import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { ReqUser } from '~modules/auth/infrastructure/decorators/user/user.decorator';

import { BaseToken } from '~shared/constants';
import { drizzlePostgresModule } from '~shared/infrastructure/database/database.module';
import { SharedModule } from '~shared/shared.module';

import { POSTGRES_DB } from 'src/lib/drizzle-postgres';

// Helper functions
const createMockAppConfig = (overrides: Partial<any> = {}) => ({
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

const createMockJwtUser = (overrides: Partial<any> = {}) => ({
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

@Module({
  providers: [{ provide: POSTGRES_DB, useValue: {} }],
  exports: [POSTGRES_DB],
})
class MockDrizzlePostgresModule {}

@Controller('test-auth')
class TestAuthController {
  public static getUserSpy = jest.fn();
  public static getUserIdSpy = jest.fn();

  @Get('/user')
  getUser(@ReqUser() user: User) {
    TestAuthController.getUserSpy(user);
    return user;
  }

  @Get('/user-id')
  getUserId(@UserId() userId: string | undefined) {
    TestAuthController.getUserIdSpy(userId);
    return { userId };
  }
}

describe('Auth JWT Token (e2e)', () => {
  let app: INestApplication;
  const jwtSecret = randomBytes(64).toString('base64');
  const testUser = createMockJwtUser();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, SharedModule, CoreModule],
      controllers: [TestAuthController],
    })
      .overrideProvider(BaseToken.APP_CONFIG)
      .useValue(
        createMockAppConfig({
          JWT_SECRET: jwtSecret,
          SUPABASE_URL: 'https://example.com',
          SUPABASE_SECRET_KEY: 'test-key',
        }),
      )
      .overrideModule(drizzlePostgresModule)
      .useModule(MockDrizzlePostgresModule)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Reset spies before each test
    TestAuthController.getUserSpy.mockReset();
    TestAuthController.getUserIdSpy.mockReset();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should extract user details from JWT token', async () => {
    const token = sign(testUser, jwtSecret, { algorithm: 'HS256', expiresIn: 10000 });

    await request(app.getHttpServer()).get('/test-auth/user').set('Authorization', `Bearer ${token}`);

    expect(TestAuthController.getUserSpy).toHaveBeenCalledTimes(1);
    expect(TestAuthController.getUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: testUser.sub,
        email: testUser.email,
        phone: testUser.phone,
        role: testUser.role,
      }),
    );
  });

  it('should extract user ID from JWT token', async () => {
    const token = sign(testUser, jwtSecret, { algorithm: 'HS256' });

    await request(app.getHttpServer()).get('/test-auth/user-id').set('Authorization', `Bearer ${token}`).expect(200);

    expect(TestAuthController.getUserIdSpy).toHaveBeenCalledTimes(1);
    expect(TestAuthController.getUserIdSpy).toHaveBeenCalledWith(testUser.sub);
  });

  it('should return 401 if token is missing', async () => {
    await request(app.getHttpServer()).get('/test-auth/user-id').expect(401);
  });

  it('should return 401 if token header is empty', async () => {
    await request(app.getHttpServer()).get('/test-auth/user-id').set('Authorization', '').expect(401);
  });

  it('should return 401 if token signature is invalid', async () => {
    const token = sign(testUser, 'invalid-secret', { algorithm: 'HS256' });
    await request(app.getHttpServer()).get('/test-auth/user-id').set('Authorization', `Bearer ${token}`).expect(401);
  });

  it('should return 401 if token is expired', async () => {
    const token = sign(testUser, jwtSecret, { algorithm: 'HS256', expiresIn: 0 });
    await request(app.getHttpServer()).get('/test-auth/user-id').set('Authorization', `Bearer ${token}`).expect(401);
  });

  it('should not be vulnerable to missing algorithm in token header', async () => {
    const token = sign(testUser, jwtSecret, { algorithm: 'none', expiresIn: 10000 });
    await request(app.getHttpServer()).get('/test-auth/user-id').set('Authorization', `Bearer ${token}`).expect(401);
  });
});
