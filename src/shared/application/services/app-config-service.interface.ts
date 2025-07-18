import { type ConfigService } from '@nestjs/config';

import { type AppConfigModel } from '~shared/application/models/app-config.model';

export type IAppConfigService = ConfigService<AppConfigModel, true>;
