import { faker } from '@faker-js/faker/.';
import { Controller, Get, INestApplication, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import * as request from 'supertest';
import {
  createMockAppConfig,
  createMockExpiredJwtToken,
  createMockInvalidJwtToken,
  createMockJwtToken,
  createMockJwtUser,
} from 'test/utils/faker';

import { CoreModule } from '~core/core.module';

import { SignUpCredentialsDto } from '~modules/auth/application/dto/sign-up-credentials.dto';
import { AuthModule } from '~modules/auth/auth.module';
import { User } from '~modules/auth/domain/entities/user.entity';
import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { ReqUser } from '~modules/auth/infrastructure/decorators/user/user.decorator';

import { BaseToken } from '~shared/constants';
import { UserRole } from '~shared/domain/enums/user-role.enum';
import { drizzlePostgresModule } from '~shared/infrastructure/database/database.module';
import { SharedModule } from '~shared/shared.module';

import { POSTGRES_DB } from 'src/lib/drizzle-postgres';

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

describe('Auth Comprehensive E2E Tests', () => {
  let app: INestApplication;
  const jwtSecret = randomBytes(64).toString('base64');
  const testUser = createMockJwtUser();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, SharedModule, CoreModule],
      controllers: [TestAuthController],
    })
      .overrideProvider(BaseToken.APP_CONFIG)
      .useValue(createMockAppConfig({ JWT_SECRET: jwtSecret }))
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

  describe('Sign Up', () => {
    it('should reject sign up if email is invalid', async () => {
      const signUpData: SignUpCredentialsDto = {
        email: 'invalid-email',
        password: 'StrongPassword123!',
        role: UserRole.CANDIDATE,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(signUpData).expect(400);
    });

    it('should reject sign up if role is invalid', async () => {
      const signUpData = {
        email: faker.internet.email(),
        password: 'StrongPassword123!',
        role: 'invalid-role',
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(signUpData).expect(400);
    });

    // TODO: Postpone this test until we have a way to test both roles
    // it('should accept both candidate and recruiter roles', async () => {
    //   const candidateData: SignUpCredentialsDto = {
    //     email: faker.internet.email(),
    //     password: 'StrongPassword123!',
    //     role: UserRole.CANDIDATE,
    //   };

    //   const recruiterData: SignUpCredentialsDto = {
    //     email: faker.internet.email(),
    //     password: 'StrongPassword123!',
    //     role: UserRole.RECRUITER,
    //   };

    //   await request(app.getHttpServer()).post('/auth/sign-up').send(candidateData).expect(201);

    //   await request(app.getHttpServer()).post('/auth/sign-up').send(recruiterData).expect(201);
    // });
  });

  describe('Sign In', () => {
    it('should reject sign in with invalid email format', async () => {
      const signInData = {
        email: 'invalid-email',
        password: 'StrongPassword123!',
      };

      await request(app.getHttpServer()).post('/auth/sign-in').send(signInData).expect(400);
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid JWT token', async () => {
      const token = createMockJwtToken(testUser, jwtSecret);

      await request(app.getHttpServer()).get('/test-auth/user').set('Authorization', `Bearer ${token}`).expect(200);

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

    it('should reject access to protected route without token', async () => {
      await request(app.getHttpServer()).get('/test-auth/user').expect(401);
    });

    it('should reject access to protected route with invalid token', async () => {
      const invalidToken = createMockInvalidJwtToken(testUser);

      await request(app.getHttpServer())
        .get('/test-auth/user')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });

    it('should reject access to protected route with expired token', async () => {
      const expiredToken = createMockExpiredJwtToken(testUser, jwtSecret);

      await request(app.getHttpServer())
        .get('/test-auth/user')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Google OAuth2', () => {
    it('should initiate Google OAuth2 flow', async () => {
      await request(app.getHttpServer()).get('/auth/oauth/google').expect(302); // Redirect to Google OAuth
    });
  });

  describe('Input Validation', () => {
    it('should validate required fields in sign up', async () => {
      const invalidSignUpData = {
        email: faker.internet.email(),
        // missing password and role
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(invalidSignUpData).expect(400);
    });

    it('should validate required fields in sign in', async () => {
      const invalidSignInData = {
        email: faker.internet.email(),
        // missing password
      };

      await request(app.getHttpServer()).post('/auth/sign-in').send(invalidSignInData).expect(400);
    });

    it('should validate email format in all endpoints', async () => {
      const invalidEmailData = {
        email: 'not-an-email',
        password: 'StrongPassword123!',
        role: UserRole.CANDIDATE,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(invalidEmailData).expect(400);

      await request(app.getHttpServer()).post('/auth/sign-in').send(invalidEmailData).expect(400);
    });
  });
});
