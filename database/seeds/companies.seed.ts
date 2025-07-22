import { createSeedClient } from '@snaplet/seed';

import { CompanyPermissionList, CompanyRoleType } from 'src/modules/companies/domain/enums/company-management.enum';

const COMPANY_PERMISSIONS = [
  { name: CompanyPermissionList.CREATE_JOBS, description: 'Can create job postings' },
  { name: CompanyPermissionList.EDIT_JOBS, description: 'Can edit job postings' },
  { name: CompanyPermissionList.DELETE_JOBS, description: 'Can delete job postings' },
  { name: CompanyPermissionList.PUBLISH_JOBS, description: 'Can publish job postings' },
  { name: CompanyPermissionList.VIEW_CANDIDATES, description: 'Can view candidate profiles' },
  { name: CompanyPermissionList.CONTACT_CANDIDATES, description: 'Can contact candidates' },
  { name: CompanyPermissionList.MANAGE_APPLICATIONS, description: 'Can manage job applications' },
  { name: CompanyPermissionList.INVITE_USERS, description: 'Can invite users to company' },
  { name: CompanyPermissionList.REMOVE_USERS, description: 'Can remove users from company' },
  { name: CompanyPermissionList.MANAGE_USER_ROLES, description: 'Can manage user roles in company' },
  { name: CompanyPermissionList.EDIT_COMPANY_INFO, description: 'Can edit company information' },
  { name: CompanyPermissionList.DELETE_COMPANY, description: 'Can delete company' },
  { name: CompanyPermissionList.VIEW_ANALYTICS, description: 'Can view company analytics' },
  { name: CompanyPermissionList.EXPORT_DATA, description: 'Can export company data' },
  { name: CompanyPermissionList.MANAGE_COMPANY_SETTINGS, description: 'Can manage company settings' },
];

const COMPANY_ROLES = [
  {
    name: CompanyRoleType.ADMIN,
    description: 'Full access to company management',
    isDefault: false,
    isSystem: true,
  },
  {
    name: CompanyRoleType.MEMBER,
    description: 'Basic access for job creation and candidate communication',
    isDefault: true,
    isSystem: true,
  },
];

const MEMBER_PERMISSIONS = [
  CompanyPermissionList.CREATE_JOBS,
  CompanyPermissionList.EDIT_JOBS,
  CompanyPermissionList.PUBLISH_JOBS,
  CompanyPermissionList.VIEW_CANDIDATES,
  CompanyPermissionList.CONTACT_CANDIDATES,
  CompanyPermissionList.MANAGE_APPLICATIONS,
];

const main = async () => {
  const shouldReset = process.argv.includes('--reset');
  const shouldDryRun = process.argv.includes('--dry-run');
  const seed = await createSeedClient({ dryRun: shouldDryRun || false });

  if (shouldReset) {
    await seed.$resetDatabase(['public.company_role_permission', 'public.company_role', 'public.company_permission']);
  }

  const permissions = await seed.company_permission(
    COMPANY_PERMISSIONS.map((p) => ({
      name: p.name,
      description: p.description,
    })),
  );

  const roles = await seed.company_role(
    COMPANY_ROLES.map((r) => ({
      name: r.name,
      description: r.description,
      is_default: r.isDefault,
      is_system: r.isSystem,
    })),
  );

  const adminRoleId = roles.company_role.find((r) => r.name === CompanyRoleType.ADMIN)?.id;
  const adminRolePermissions = permissions.company_permission
    .map((perm) => ({
      company_role_id: adminRoleId,
      company_permission_id: perm.id,
    }))
    .filter((item) => item.company_role_id && item.company_permission_id);
  await seed.company_role_permission(adminRolePermissions);

  const memberRoleId = roles.company_role.find((r) => r.name === CompanyRoleType.MEMBER)?.id;
  const memberRolePermissions = permissions.company_permission
    .filter((perm) => MEMBER_PERMISSIONS.includes(perm.name as CompanyPermissionList))
    .map((perm) => ({
      company_role_id: memberRoleId,
      company_permission_id: perm.id,
    }))
    .filter((item) => item.company_role_id && item.company_permission_id);
  await seed.company_role_permission(memberRolePermissions);

  process.exit();
};

main();
