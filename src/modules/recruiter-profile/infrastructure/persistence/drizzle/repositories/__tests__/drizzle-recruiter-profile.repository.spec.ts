import { DrizzleRecruiterProfileRepository } from '../drizzle-recruiter-profile.repository';

describe('DrizzleRecruiterProfileRepository', () => {
  let repository: DrizzleRecruiterProfileRepository;
  let db: any;
  let mapper: any;
  let supabaseClientService: any;

  beforeEach(() => {
    db = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };
    mapper = { toDomain: jest.fn(), toPersistence: jest.fn() };
    supabaseClientService = {};
    repository = new DrizzleRecruiterProfileRepository(db, mapper, supabaseClientService);
  });

  it('should return null if no result found', async () => {
    db.limit.mockResolvedValue([]);
    const result = await repository.findByUserDetailsId('id');
    expect(result).toBeNull();
  });

  it('should return domain if result found', async () => {
    db.limit.mockResolvedValue([{ id: '1' }]);
    mapper.toDomain.mockReturnValue('domain');
    const result = await repository.findByUserDetailsId('id');
    expect(mapper.toDomain).toHaveBeenCalled();
    expect(result).toBe('domain');
  });
});
