import { faker } from '@faker-js/faker/.';
import { Controller, Get, INestApplication, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import * as request from 'supertest';
import {
  createMockAppConfig,
  createMockJwtToken,
  createMockJwtUser,
  createMockSqlInjectionData,
  createMockXssData,
} from 'test/utils/faker';

import { CoreModule } from '~core/core.module';

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

describe('Auth Error Cases E2E Tests', () => {
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

  describe('Input Sanitization', () => {
    it('should handle SQL injection attempts in email field', async () => {
      const sqlInjectionData = {
        email: createMockSqlInjectionData(),
        password: 'StrongPassword123!',
        role: UserRole.RECRUITER,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(sqlInjectionData).expect(400);
    });

    it('should handle XSS attempts in email field', async () => {
      const xssData = {
        email: createMockXssData(),
        password: 'StrongPassword123!',
        role: UserRole.RECRUITER,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(xssData).expect(400);
    });

    it('should handle extremely long email addresses', async () => {
      const longEmail = 'a'.repeat(1000) + '@example.com';
      const longEmailData = {
        email: longEmail,
        password: 'StrongPassword123!',
        role: UserRole.RECRUITER,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(longEmailData).expect(400);
    });

    it('should handle extremely long passwords', async () => {
      const longPassword = 'a'.repeat(10000);
      const longPasswordData = {
        email: faker.internet.email(),
        password: longPassword,
        role: UserRole.RECRUITER,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(longPasswordData).expect(400);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty request body', async () => {
      await request(app.getHttpServer()).post('/auth/sign-up').send({}).expect(400);

      await request(app.getHttpServer()).post('/auth/sign-in').send({}).expect(400);
    });

    it('should handle null values in request body', async () => {
      const nullData = {
        email: null,
        password: null,
        role: null,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(nullData).expect(400);
    });

    it('should handle undefined values in request body', async () => {
      const undefinedData = {
        email: undefined,
        password: undefined,
        role: undefined,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(undefinedData).expect(400);
    });

    it('should handle whitespace-only values', async () => {
      const whitespaceData = {
        email: '   ',
        password: '   ',
        role: UserRole.RECRUITER,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(whitespaceData).expect(400);
    });
  });

  describe('Authorization Header Edge Cases', () => {
    it('should handle missing Authorization header', async () => {
      await request(app.getHttpServer()).get('/test-auth/user-id').expect(401);
    });

    it('should handle empty Authorization header', async () => {
      await request(app.getHttpServer()).get('/test-auth/user-id').set('Authorization', '').expect(401);
    });

    it('should handle Authorization header without Bearer prefix', async () => {
      const token = createMockJwtToken(testUser, jwtSecret);
      await request(app.getHttpServer()).get('/test-auth/user-id').set('Authorization', token).expect(401);
    });
  });

  describe('Unicode and International Characters', () => {
    it('should handle emoji in email', async () => {
      const emojiData = {
        email: 'test😀@example.com',
        password: 'StrongPassword123!',
        role: UserRole.CANDIDATE,
      };

      await request(app.getHttpServer()).post('/auth/sign-up').send(emojiData).expect(400);
    });
  });
});
