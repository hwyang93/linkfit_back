import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class SearchInstructorDto extends PaginationDto {
  @ApiProperty({ type: () => Array(String), description: '직무', default: () => Array(String), required: false })
  fields: string[];
}
