import { RecruiterProfile } from '../../../entities/recruiter-profile.entity';
import { type IRecruiterProfileDataAccess, RecruiterProfileMapper } from '../recruiter-profile.mapper';

describe('RecruiterProfileMapper', () => {
  let mapper: RecruiterProfileMapper;

  beforeEach(() => {
    mapper = new RecruiterProfileMapper();
  });

  it('should map persistence to domain', () => {
    const persistence: IRecruiterProfileDataAccess = {
      id: '1',
      userDetailsId: 'user-1',
      telegram: 'tg',
      phone: '123',
      linkedin: 'li',
      website: 'web',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    };
    const domain = mapper.toDomain(persistence, 'company-1');
    expect(domain).toBeInstanceOf(RecruiterProfile);
    expect(domain.id).toBe('1');
    expect(domain.activeCompanyId).toBe('company-1');
  });

  it('should map domain to persistence', () => {
    const domain = RecruiterProfile.builder('user-1')
      .id('1')
      .telegram('tg')
      .phone('123')
      .linkedin('li')
      .website('web')
      .createdAt(new Date('2023-01-01'))
      .updatedAt(new Date('2023-01-02'))
      .build();
    const persistence = mapper.toPersistence(domain);
    expect(persistence.id).toBe('1');
    expect(persistence.userDetailsId).toBe('user-1');
  });
});
