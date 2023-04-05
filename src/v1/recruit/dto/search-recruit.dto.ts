import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class SearchRecruitDto extends PaginationDto {
  @ApiProperty({ description: 'type', default: 'list', enum: ['list', 'marker'], required: false })
  type = 'list';

  @ApiProperty({ description: '직무', required: false })
  fields: string[];

  @ApiProperty({ description: '수업시간', required: false })
  times: string[];

  @ApiProperty({ description: '채용형태', required: false })
  recruitTypes: string[];

  @ApiProperty({ description: '지역', required: false })
  area: string;

  @ApiProperty({ description: '본인이 작성한 게시글 여부', default: 'N', required: false })
  isWriter: string;

  @ApiProperty({ description: '진행 여부', required: false })
  status: string;

  @ApiProperty({ description: '기간', required: false })
  period: string;
}
