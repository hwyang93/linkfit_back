import { PartialType } from '@nestjs/swagger';
import { CreateRecruitDto } from './create-recruit.dto';

export class UpdateRecruitDto extends PartialType(CreateRecruitDto) {}
