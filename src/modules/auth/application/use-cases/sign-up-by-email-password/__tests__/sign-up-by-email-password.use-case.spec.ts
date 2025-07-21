import { UserAlreadyExistsException } from '~modules/auth/application/exceptions/user-already-exists.exception';
import { UserCreatedEvent } from '~modules/auth/domain/events/user-created.event';

import { SignUpByEmailPasswordUseCase } from '../sign-up-by-email-password.use-case';

describe('SignUpByEmailPasswordUseCase', () => {
  let useCase: SignUpByEmailPasswordUseCase;
  let authService: any;
  let appConfig: any;

  beforeEach(() => {
    authService = {
      getUserByEmail: jest.fn(),
      signUpByEmailPassword: jest.fn(),
    };
    appConfig = { get: jest.fn() };
    useCase = new SignUpByEmailPasswordUseCase(authService, appConfig);
    useCase['_dbContext'] = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    useCase['_eventDispatcher'] = {
      registerEvent: jest.fn(),
      dispatchEvents: jest.fn(),
    } as any;
  });

  it('should throw if user already exists', async () => {
    authService.getUserByEmail.mockResolvedValue({ id: 'u1' });
    try {
      await useCase.execute({ email: 'a@mail.com', password: '123', role: 'user' } as any);
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(UserAlreadyExistsException);
    }
  });

  it('should sign up and register event if user does not exist', async () => {
    authService.getUserByEmail.mockResolvedValue(null);
    authService.signUpByEmailPassword.mockResolvedValue({ id: 'u2' });
    appConfig.get.mockReturnValue('redirect-url');
    await useCase.execute({ email: 'a@mail.com', password: '123', role: 'user' } as any);
    expect(authService.signUpByEmailPassword).toHaveBeenCalledWith('a@mail.com', '123', 'redirect-url');
    expect(useCase['_eventDispatcher'].registerEvent).toHaveBeenCalledWith(expect.any(UserCreatedEvent));
  });
});
