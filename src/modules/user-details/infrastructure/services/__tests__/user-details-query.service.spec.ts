import { type IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';

import { UserRole } from '~shared/domain/enums/user-role.enum';

import { UserDetailsQueryService } from '../user-details-query.service';

describe('UserDetailsQueryService', () => {
  let service: UserDetailsQueryService;
  let getUserDetailsByUserIdUseCase: jest.Mocked<IGetUserDetailsByIdUseCase>;

  beforeEach(() => {
    getUserDetailsByUserIdUseCase = {
      execute: jest.fn(),
    } as any;
    service = new UserDetailsQueryService(getUserDetailsByUserIdUseCase);
  });

  it('should return user details by userId', async () => {
    const userDetails = UserDetails.builder('user-1', UserRole.CANDIDATE).id('id-1').build();
    getUserDetailsByUserIdUseCase.execute.mockResolvedValue(userDetails);
    const result = await service.getUserDetailsByUserId('user-1');
    expect(getUserDetailsByUserIdUseCase.execute).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(result).toBe(userDetails);
  });

  it('should return null if not found', async () => {
    getUserDetailsByUserIdUseCase.execute.mockResolvedValue(null);
    const result = await service.getUserDetailsByUserId('user-1');
    expect(result).toBeNull();
  });
});
