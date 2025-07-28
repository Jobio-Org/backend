import { Test, type TestingModule } from '@nestjs/testing';

import { type GetCompanyByIdResponseDto } from '~modules/companies/application/dto/companies/get-company-by-id.dto';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { GetCompanyByIdUseCase } from '~modules/companies/application/use-cases/companies/get-company-by-id/get-company-by-id.use-case';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { type ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';
import { CompanyWithCategoriesService } from '~modules/companies/infrastructure/services/company-with-categories.service';

describe('GetCompanyByIdUseCase', () => {
  let useCase: GetCompanyByIdUseCase;
  let companyRepository: ICompanyRepository;
  let companyWithCategoriesService: CompanyWithCategoriesService;

  const mockCompany: Company = Company.builder('Test Company')
    .id('company-id')
    .description('Test description')
    .website('https://test.com')
    .logo('https://test.com/logo.png')
    .industry('Technology')
    .size('100-500')
    .location('Kyiv')
    .isActive(true)
    .createdAt(new Date('2023-01-01'))
    .updatedAt(new Date('2023-01-02'))
    .build();

  const mockCompanyWithCategories: GetCompanyByIdResponseDto = {
    id: 'company-id',
    name: 'Test Company',
    description: 'Test description',
    website: 'https://test.com',
    logo: 'https://test.com/logo.png',
    industry: 'Technology',
    size: '100-500',
    location: 'Kyiv',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    categories: [
      {
        categoryId: 'cat-1',
        categoryName: 'Technology',
        subCategoryId: 'sub-1',
        subCategoryName: 'Web Development',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCompanyByIdUseCase,
        {
          provide: CompaniesDiToken.COMPANY_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CompanyWithCategoriesService,
          useValue: {
            getCompanyWithCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetCompanyByIdUseCase>(GetCompanyByIdUseCase);
    companyRepository = module.get(CompaniesDiToken.COMPANY_REPOSITORY);
    companyWithCategoriesService = module.get(CompanyWithCategoriesService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return company with categories', async () => {
      const companyId = 'company-id';

      jest.spyOn(companyRepository, 'findById').mockResolvedValue(mockCompany);
      jest.spyOn(companyWithCategoriesService, 'getCompanyWithCategories').mockResolvedValue(mockCompanyWithCategories);

      const result = await useCase.execute({ companyId });

      expect(result).toEqual(mockCompanyWithCategories);
      expect(companyRepository.findById).toHaveBeenCalledWith(companyId);
      expect(companyWithCategoriesService.getCompanyWithCategories).toHaveBeenCalledWith(companyId);
    });

    it('should throw CompanyNotFoundException when company not found', async () => {
      const companyId = 'non-existent-company-id';

      jest.spyOn(companyRepository, 'findById').mockResolvedValue(null);

      await expect(useCase.execute({ companyId })).rejects.toThrow(EntityNotFoundException);
      expect(companyRepository.findById).toHaveBeenCalledWith(companyId);
      expect(companyWithCategoriesService.getCompanyWithCategories).not.toHaveBeenCalled();
    });
  });
});
