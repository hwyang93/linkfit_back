import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';

@Module({
  controllers: [InquiryController],
  providers: [InquiryService]
})
export class InquiryModule {}
