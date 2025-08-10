import { Inject, Injectable } from '@nestjs/common';

import { EventsHandler, IEventHandler } from '~lib/nest-event-driven';

import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { CompanyLogoUploadedEvent } from '~modules/companies/domain/events/company-logo-uploaded.event';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

@Injectable()
@EventsHandler(CompanyLogoUploadedEvent)
export class CompanyLogoUploadedEventHandler implements IEventHandler<CompanyLogoUploadedEvent> {
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async handle(event: CompanyLogoUploadedEvent): Promise<void> {
    try {
      const { companyId, logoUrl } = event.payload;

      const existingCompany = await this.companyRepository.findById(companyId);
      if (!existingCompany) {
        console.error(`Company with ID ${companyId} not found for logo update`);
        return;
      }

      const updatedCompany = Company.builder(existingCompany.name)
        .id(existingCompany.id)
        .slug(existingCompany.slug)
        .description(existingCompany.description)
        .website(existingCompany.website)
        .logo(logoUrl)
        .size(existingCompany.size)
        .location(existingCompany.location)
        .isActive(existingCompany.isActive)
        .createdAt(existingCompany.createdAt)
        .updatedAt(new Date())
        .build();

      await this.companyRepository.save(updatedCompany);
    } catch (error) {
      console.error('Failed to update company logo URL:', error);
      throw error;
    }
  }
}
