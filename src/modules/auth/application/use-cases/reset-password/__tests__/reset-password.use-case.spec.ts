import { PasswordRecoveryTimeExceededException } from '~modules/auth/application/exceptions/password-recovery-time-exceeded.exception';
import { UserHasNoPasswordException } from '~modules/auth/application/exceptions/user-has-no-password.exception';
import { User } from '~modules/auth/domain/entities/user.entity';

import { ResetPasswordUseCase } from '../reset-password.use-case';

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let authService: any;
  let appConfig: any;
  let dbContext: any;

  beforeEach(() => {
    authService = { updatePassword: jest.fn() };
    appConfig = { get: jest.fn() };
    dbContext = {
      userRepository: { findHashedPassword: jest.fn() },
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    };
    useCase = new ResetPasswordUseCase(authService, appConfig, dbContext);
    useCase['_dbContext'] = dbContext;
    useCase['_eventDispatcher'] = { dispatchEvents: jest.fn() } as any;
  });

  it('should throw if user has no password', async () => {
    dbContext.userRepository.findHashedPassword.mockResolvedValue(null);
    const user = User.builder('u1').build();
    user.isPasswordRecoveryWithinTime = jest.fn();
    try {
      await useCase.execute({ user, newPassword: '123' });
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(UserHasNoPasswordException);
    }
  });

  it('should throw if recovery time exceeded', async () => {
    dbContext.userRepository.findHashedPassword.mockResolvedValue('hash');
    appConfig.get.mockReturnValue(1000);
    const user = User.builder('u1').build();
    user.isPasswordRecoveryWithinTime = jest.fn().mockReturnValue(false);
    try {
      await useCase.execute({ user, newPassword: '123' });
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(PasswordRecoveryTimeExceededException);
    }
  });

  it('should update password if all ok', async () => {
    dbContext.userRepository.findHashedPassword.mockResolvedValue('hash');
    appConfig.get.mockReturnValue(1000);
    const user = User.builder('u1').build();
    user.isPasswordRecoveryWithinTime = jest.fn().mockReturnValue(true);
    await useCase.execute({ user, newPassword: '123' });
    expect(authService.updatePassword).toHaveBeenCalledWith('123');
  });
});
