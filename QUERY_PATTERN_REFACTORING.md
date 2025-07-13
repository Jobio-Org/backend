# Рефакторинг з використанням Query Pattern

## Проблема

Раніше модуль `companies` використовував репозиторії з модуля `profiles` напряму:

```typescript
// Старий підхід - порушення принципів Clean Architecture
@Injectable()
export class UserProfileService {
  constructor(
    @Inject(ProfilesDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
    @Inject(ProfilesDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
  ) {}
}
```

Це порушувало принципи:
- **Clean Architecture**: Модуль `companies` мав доступ до внутрішньої структури модуля `profiles`
- **DDD**: Розкривався домен модуля `profiles` зовнішньому модулю
- **Модульність**: Створювалася тісна зв'язність між модулями

## Рішення

Реалізовано Query Pattern з наступною структурою:

### 1. Query Use Case в модулі profiles

```typescript
// src/modules/profiles/application/use-cases/get-recruiter-profile-id/
export interface IGetRecruiterProfileIdUseCase {
  execute(dto: GetRecruiterProfileIdDto): Promise<string | null>;
}

@Injectable()
export class GetRecruiterProfileIdUseCase implements IGetRecruiterProfileIdUseCase {
  constructor(
    @Inject(ProfilesDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
    @Inject(ProfilesDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
  ) {}

  async execute(dto: GetRecruiterProfileIdDto): Promise<string | null> {
    // Бізнес логіка залишається в модулі profiles
  }
}
```

### 2. Query Service для експорту

```typescript
// src/modules/profiles/application/services/profiles-query-service.interface.ts
export interface IProfilesQueryService {
  getRecruiterProfileIdByUserId(userId: string): Promise<string | null>;
}

// src/modules/profiles/infrastructure/services/profiles-query.service.ts
@Injectable()
export class ProfilesQueryService implements IProfilesQueryService {
  constructor(
    @Inject(ProfilesDiToken.GET_RECRUITER_PROFILE_ID_USE_CASE)
    private readonly getRecruiterProfileIdUseCase: IGetRecruiterProfileIdUseCase,
  ) {}

  async getRecruiterProfileIdByUserId(userId: string): Promise<string | null> {
    const dto = new GetRecruiterProfileIdDto(userId);
    return this.getRecruiterProfileIdUseCase.execute(dto);
  }
}
```

### 3. Використання в модулі companies

```typescript
// src/modules/companies/infrastructure/services/company-permission/company-permission.service.ts
@Injectable()
export class CompanyPermissionService implements ICompanyPermissionService {
  constructor(
    @Inject(ProfilesDiToken.PROFILES_QUERY_SERVICE)
    private readonly profilesQueryService: IProfilesQueryService,
  ) {}

  async canEditCompanyInfo(userId: string, companyId: string): Promise<boolean> {
    const recruiterProfileId = await this.profilesQueryService.getRecruiterProfileIdByUserId(userId);
    // Далі логіка перевірки прав...
  }
}
```

## Переваги нового підходу

1. **Дотримання принципів Clean Architecture**: Модуль `companies` не знає про внутрішню структуру модуля `profiles`
2. **DDD Compliance**: Кожен модуль контролює свій домен
3. **Модульність**: Чіткі межі між модулями
4. **Тестованість**: Легше мокати Query Service замість репозиторіїв
5. **Розширюваність**: Можна легко додавати нові Query без зміни існуючого коду

## Структура файлів

```
src/modules/profiles/
├── application/
│   ├── use-cases/
│   │   └── get-recruiter-profile-id/
│   │       ├── get-recruiter-profile-id.dto.ts
│   │       ├── get-recruiter-profile-id-use-case.interface.ts
│   │       └── get-recruiter-profile-id.use-case.ts
│   └── services/
│       └── profiles-query-service.interface.ts
└── infrastructure/
    └── services/
        └── profiles-query.service.ts
```

## Реєстрація в модулі

```typescript
// src/modules/profiles/profiles.module.ts
@Module({
  providers: [
    // ... інші провайдери
    { provide: ProfilesDiToken.GET_RECRUITER_PROFILE_ID_USE_CASE, useClass: GetRecruiterProfileIdUseCase },
    { provide: ProfilesDiToken.PROFILES_QUERY_SERVICE, useClass: ProfilesQueryService },
  ],
  exports: [
    // ... інші експорти
    ProfilesDiToken.PROFILES_QUERY_SERVICE,
  ],
})
export class ProfilesModule {}
```

## Виправлення циклічної залежності

Після рефакторингу виникла циклічна залежність:
```
AppModule -> SharedModule -> SeedsModule -> CompaniesModule -> ProfilesModule -> SharedModule
```

### Рішення

Використано `forwardRef()` для розриву циклу:

```typescript
// src/modules/profiles/profiles.module.ts
@Module({
  imports: [AuthModule, forwardRef(() => SharedModule)],
  // ...
})

// src/modules/companies/companies.module.ts  
@Module({
  imports: [forwardRef(() => SharedModule), ProfilesModule],
  // ...
})
```

Це дозволило зберегти архітектурну чистоту та уникнути циклічних залежностей.

## Висновок

Query Pattern дозволив зберегти функціональність, але зробити код більш архітектурно правильним та підтримуваним. Тепер модулі взаємодіють через чітко визначені інтерфейси, а не через прямі залежності від внутрішніх компонентів. Використання `forwardRef()` вирішило проблему циклічних залежностей, що виникла після рефакторингу. 