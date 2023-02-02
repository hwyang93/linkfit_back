import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../common/decorators/member.decorator';
import { Member } from '../entites/Member';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: '업체 정보 조회' })
  @Get(':seq')
  async getCompanyInfo(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.companyService.getCompanyInfo(seq, member);
  }
}
