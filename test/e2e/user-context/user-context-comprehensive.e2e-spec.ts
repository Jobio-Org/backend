import { faker } from '@faker-js/faker';
import { type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { type User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as request from 'supertest';
import {
  createMockAppConfig,
  createMockExpiredJwtToken,
  createMockInvalidJwtToken,
  createMockJwtToken,
  createMockJwtUser,
  createMockSupabaseClient,
} from 'test/utils/faker';

import { CoreModule } from '~core/core.module';

import { POSTGRES_DB } from '~lib/drizzle-postgres/constants';

import { AuthModule } from '~modules/auth/auth.module';
import { UserContextModule } from '~modules/user-context/user-context.module';

import { BaseToken } from '~shared/constants';
import { UserRole } from '~shared/domain/enums/user-role.enum';
import { drizzlePostgresModule } from '~shared/infrastructure/database/database.module';
import { type MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import {
  company,
  recruiterProfile,
  userCompany,
  userDetails,
} from '~shared/infrastructure/database/drizzle/schema/public-database-schema';
import { SharedModule } from '~shared/shared.module';

const supabase = createMockSupabaseClient();

const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user;
};

describe('UserContext Comprehensive E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [drizzlePostgresModule, AuthModule, UserContextModule, SharedModule, CoreModule],
    })
      .overrideProvider(BaseToken.APP_CONFIG)
      .useValue(createMockAppConfig())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe(`User Context for ${UserRole.RECRUITER}`, () => {
    it(`should sign up, confirm email, login and get user context for ${UserRole.RECRUITER} if email is confirmed`, async () => {
      let localUserId: string | undefined;

      try {
        const email = faker.internet.email();
        const password = 'StrongPassword123!';

        await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({ email, password, role: UserRole.RECRUITER })
          .expect(201);

        // Confirm email via Supabase Admin API to mock confirm email
        const user = await findUserByEmail(email);
        localUserId = user?.id;
        expect(localUserId).toBeTruthy();
        await supabase.auth.admin.updateUserById(localUserId, { email_confirm: true });

        const signInRes = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({ email, password })
          .expect(201);
        const accessToken = signInRes.body.accessToken;

        const res = await request(app.getHttpServer())
          .get('/auth/user/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('role', UserRole.RECRUITER);
        expect(res.body).toHaveProperty('profile');
        expect(res.body.profile).not.toBeNull();
      } finally {
        if (localUserId && app) {
          await supabase.auth.admin.deleteUser(localUserId);
          const db = app.get(POSTGRES_DB) as NodePgDatabase<MergedDbSchema>;

          const [userDetailsRow] = await db.select().from(userDetails).where(eq(userDetails.userId, localUserId));
          const userDetailsId = userDetailsRow?.id;
          if (!userDetailsId) return;

          const [recruiterProfileRow] = await db
            .select()
            .from(recruiterProfile)
            .where(eq(recruiterProfile.userDetailsId, userDetailsId));
          const recruiterProfileId = recruiterProfileRow?.id;

          const userCompanyRows = recruiterProfileId
            ? await db.select().from(userCompany).where(eq(userCompany.recruiterProfileId, recruiterProfileId))
            : [];
          const companyIds = userCompanyRows.map((r) => r.companyId);

          await db.delete(userDetails).where(eq(userDetails.id, userDetailsId));

          for (const companyId of companyIds) {
            await db.delete(company).where(eq(company.id, companyId));
          }
        }
      }
    });

    it('should not allow sign-in if email is not confirmed', async () => {
      let localUserId: string | undefined;

      try {
        const email = faker.internet.email();
        const password = 'StrongPassword123!';

        await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({ email, password, role: UserRole.RECRUITER })
          .expect(201);

        const user = await findUserByEmail(email);
        localUserId = user?.id;
        expect(localUserId).toBeTruthy();

        await request(app.getHttpServer()).post('/auth/sign-in').send({ email, password }).expect(401);
      } finally {
        if (localUserId && app) {
          await supabase.auth.admin.deleteUser(localUserId);
        }
      }
    });
  });

  describe('Protected Route Edge Cases', () => {
    it('should reject access to user context without token', async () => {
      await request(app.getHttpServer()).get('/auth/user/me').expect(401);
    });

    it('should reject access to user context with invalid token', async () => {
      const invalidToken = createMockInvalidJwtToken(createMockJwtUser());
      await request(app.getHttpServer())
        .get('/auth/user/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });

    it('should reject access to user context with expired token', async () => {
      const expiredToken = createMockExpiredJwtToken(createMockJwtUser(), process.env.JWT_SECRET_TEST);
      await request(app.getHttpServer())
        .get('/auth/user/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('User Context Not Found', () => {
    it('should return 404 if user details not found', async () => {
      const fakeUser = createMockJwtUser({ sub: faker.string.uuid() });
      const token = createMockJwtToken(fakeUser, process.env.JWT_SECRET_TEST);
      await request(app.getHttpServer()).get('/auth/user/me').set('Authorization', `Bearer ${token}`).expect(404);
    });
  });
});
