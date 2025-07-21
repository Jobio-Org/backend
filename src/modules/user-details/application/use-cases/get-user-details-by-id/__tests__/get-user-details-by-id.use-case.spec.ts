import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';
import { type IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { UserRole } from '~shared/domain/enums/user-role.enum';

import { GetUserDetailsByIdUseCase } from '../get-user-details-by-id.use-case';

describe('GetUserDetailsByIdUseCase', () => {
  let useCase: GetUserDetailsByIdUseCase;
  let repository: jest.Mocked<IUserDetailsRepository>;

  beforeEach(() => {
    repository = {
      findByUserId: jest.fn(),
    } as any;
    useCase = new GetUserDetailsByIdUseCase(repository);
  });

  it('should return user details if found', async () => {
    const userDetails = UserDetails.builder('user-1', UserRole.CANDIDATE).id('id-1').build();
    repository.findByUserId.mockResolvedValue(userDetails);
    const result = await useCase.execute({ userId: 'user-1' });
    expect(result).toBe(userDetails);
  });

  it('should return null if not found', async () => {
    repository.findByUserId.mockResolvedValue(null);
    const result = await useCase.execute({ userId: 'user-1' });
    expect(result).toBeNull();
  });
});
