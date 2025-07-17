import { type InjectionToken } from '@nestjs/common';

export interface IWithProviderToken {
  provideAs?: InjectionToken;
}
