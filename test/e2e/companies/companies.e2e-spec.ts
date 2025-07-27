import { faker } from '@faker-js/faker';
import { type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { type User, createClient } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as request from 'supertest';
import { createMockAppConfig, createMockSupabaseClient } from 'test/utils/faker';

import { CoreModule } from '~core/core.module';

import { POSTGRES_DB } from '~lib/drizzle-postgres/constants';

import { AuthModule } from '~modules/auth/auth.module';
import { CompanyRoleType } from '~modules/companies/domain/enums/company-management.enum';
import { CompanyPermissionList } from '~modules/companies/domain/enums/company-management.enum';
import { UserContextModule } from '~modules/user-context/user-context.module';

import { BaseToken } from '~shared/constants';
import { UserRole } from '~shared/domain/enums/user-role.enum';
import { drizzlePostgresModule } from '~shared/infrastructure/database/database.module';
import { type MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import {
  company,
  companyInvitation,
  companyPermission,
  companyRole,
  userCompany,
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

describe('Companies E2E', () => {
  let app: INestApplication;
  let db: NodePgDatabase<MergedDbSchema>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [drizzlePostgresModule, AuthModule, UserContextModule, SharedModule, CoreModule],
    })
      .overrideProvider(BaseToken.APP_CONFIG)
      .useValue(createMockAppConfig())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    db = app.get(POSTGRES_DB) as NodePgDatabase<MergedDbSchema>;
  });

  beforeEach(async () => {
    await db.delete(companyInvitation);
    await db.delete(company);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a list of companies (GET /companies)', async () => {
    const companies = [
      { name: faker.company.name(), description: faker.company.catchPhrase() },
      { name: faker.company.name(), description: faker.company.catchPhrase() },
    ];
    const insertedCompanies = await db.insert(company).values(companies).returning({ id: company.id });

    const res = await request(app.getHttpServer()).get('/companies').expect(200);

    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results.length).toBeGreaterThanOrEqual(2);
    expect(res.body.results[0]).toHaveProperty('id');
    expect(res.body.results[0]).toHaveProperty('name');

    for (const insertedCompany of insertedCompanies) {
      await db.delete(company).where(eq(company.id, insertedCompany.id));
    }
  });

  it(`should return companies by ${UserRole.RECRUITER} profile (GET /companies/by-recruiter/:recruiterProfileId)`, async () => {
    const userEmail = faker.internet.email().toLowerCase();
    const userPassword = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({ email: userEmail, password: userPassword, role: UserRole.RECRUITER })
      .expect(201);

    const user = await findUserByEmail(userEmail);
    await supabase.auth.admin.updateUserById(user?.id, { email_confirm: true });

    expect(user).toBeTruthy();

    const signInRes = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: userEmail, password: userPassword })
      .expect(201);
    const accessToken = signInRes.body.accessToken;

    const userContextRes = await request(app.getHttpServer())
      .get('/auth/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const recruiterProfileId = userContextRes.body.profile.id;

    const res = await request(app.getHttpServer()).get(`/companies/by-recruiter/${recruiterProfileId}`).expect(200);

    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results[0]).toHaveProperty('id');
    expect(res.body.results[0]).toHaveProperty('name');

    await supabase.auth.admin.deleteUser(user?.id);
  });

  // it('should update company info (PUT /companies/:companyId)', async () => {
  //   // Prepare company
  //   const companyInsert = await db.insert(company).values({ name: 'OldName' }).returning({ id: company.id });
  //   const companyId = companyInsert[0].id;

  //   // Mock JWT and permissions (skipped: here you would need a valid recruiter user with EDIT_COMPANY_INFO permission)
  //   // For now, expect 401 (unauthorized)
  //   await request(app.getHttpServer()).put(`/companies/${companyId}`).send({ name: 'NewName' }).expect(401);

  //   await db.delete(company).where(eq(company.id, companyId));
  // });

  it(`should invite ${UserRole.RECRUITER} (POST /companies/invitations) and accept invitation (POST /companies/invitations/accept)`, async () => {
    let inviterUserId: string | undefined;
    let invitedUserId: string | undefined;

    try {
      const inviterEmail = faker.internet.email().toLowerCase();
      const inviterPassword = 'StrongPassword123!';

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: inviterEmail, password: inviterPassword, role: UserRole.RECRUITER })
        .expect(201);

      const inviterUser = await findUserByEmail(inviterEmail);
      inviterUserId = inviterUser?.id;
      expect(inviterUserId).toBeTruthy();
      await supabase.auth.admin.updateUserById(inviterUserId, { email_confirm: true });

      const inviterSignInRes = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: inviterEmail, password: inviterPassword })
        .expect(201);
      const inviterAccessToken = inviterSignInRes.body.accessToken;

      const inviterUserContextRes = await request(app.getHttpServer())
        .get('/auth/user/me')
        .set('Authorization', `Bearer ${inviterAccessToken}`)
        .expect(200);
      const inviterRecruiterProfileId = inviterUserContextRes.body.profile.id;

      const [adminRole] = await db.select().from(companyRole).where(eq(companyRole.name, CompanyRoleType.ADMIN));
      const [invitePermission] = await db
        .select()
        .from(companyPermission)
        .where(eq(companyPermission.name, CompanyPermissionList.INVITE_USERS));
      expect(adminRole).toBeTruthy();
      expect(invitePermission).toBeTruthy();

      const [userCompanyRecord] = await db
        .select()
        .from(userCompany)
        .where(eq(userCompany.recruiterProfileId, inviterRecruiterProfileId));
      expect(userCompanyRecord).toBeTruthy();

      const [companyRecord] = await db.select().from(company).where(eq(company.id, userCompanyRecord.companyId));
      const companyId = companyRecord.id;
      expect(companyRecord).toBeTruthy();

      const invitedEmail = faker.internet.email().toLowerCase();
      const invitedPassword = 'StrongPassword123!';

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: invitedEmail, password: invitedPassword, role: UserRole.RECRUITER })
        .expect(201);

      const invitedUser = await findUserByEmail(invitedEmail);
      invitedUserId = invitedUser?.id;
      expect(invitedUserId).toBeTruthy();
      await supabase.auth.admin.updateUserById(invitedUserId, { email_confirm: true });

      const invitedSignInRes = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: invitedEmail, password: invitedPassword })
        .expect(201);
      const invitedAccessToken = invitedSignInRes.body.accessToken;

      await request(app.getHttpServer())
        .post('/companies/invitations')
        .set('Authorization', `Bearer ${inviterAccessToken}`)
        .send({ email: invitedEmail, companyId, roleId: adminRole.id })
        .expect(201);

      const [invitationRecord] = await db
        .select()
        .from(companyInvitation)
        .where(eq(companyInvitation.email, invitedEmail));
      const invitationToken = invitationRecord.token;

      await request(app.getHttpServer())
        .post('/companies/invitations/accept')
        .set('Authorization', `Bearer ${invitedAccessToken}`)
        .send({ token: invitationToken })
        .expect(201);

      await db.delete(company).where(eq(company.id, companyId));
    } finally {
      if (inviterUserId) {
        await supabase.auth.admin.deleteUser(inviterUserId);
      }
      if (invitedUserId) {
        await supabase.auth.admin.deleteUser(invitedUserId);
      }
    }
  });

  it('should return 401 for protected routes without token', async () => {
    await request(app.getHttpServer())
      .post('/companies/invitations')
      .send({ email: faker.internet.email(), companyId: faker.string.uuid(), roleId: faker.string.uuid() })
      .expect(401);
    await request(app.getHttpServer())
      .post('/companies/invitations/accept')
      .send({ token: faker.string.uuid() })
      .expect(401);
  });

  //   it('should return 404 for non-existent company (GET /companies/:id)', async () => {
  //     // There is no GET /companies/:id, so this is not applicable
  //     // If such endpoint appears, add this test
  //   });
});
