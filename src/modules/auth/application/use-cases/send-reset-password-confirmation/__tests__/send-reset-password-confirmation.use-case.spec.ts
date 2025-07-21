import { SendResetPasswordConfirmationUseCase } from '../send-reset-password-confirmation.use-case';

describe('SendResetPasswordConfirmationUseCase', () => {
  let useCase: SendResetPasswordConfirmationUseCase;
  let authService: any;
  let appConfig: any;

  beforeEach(() => {
    authService = { sendResetPasswordEmail: jest.fn() };
    appConfig = { get: jest.fn() };
    useCase = new SendResetPasswordConfirmationUseCase(authService, appConfig);
    useCase['_dbContext'] = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    useCase['_eventDispatcher'] = {
      dispatchEvents: jest.fn(),
    } as any;
  });

  it('should call sendResetPasswordEmail with correct params', async () => {
    appConfig.get.mockReturnValue('reset-url');
    await useCase.execute({ email: 'a@mail.com' });
    expect(authService.sendResetPasswordEmail).toHaveBeenCalledWith('a@mail.com', 'reset-url');
  });
});
