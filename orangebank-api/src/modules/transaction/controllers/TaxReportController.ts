import { Controller, Get, Param } from '@nestjs/common';
import { GetTaxReportUseCase } from '../UseCases/GetTaxReportUseCase';

@Controller('reports/tax')
export class TaxReportController {
  constructor(private readonly getTaxReportUseCase: GetTaxReportUseCase) {}

  @Get(':userId')
  async handle(@Param('userId') userId: string) {
    return this.getTaxReportUseCase.execute(userId);
  }
}
