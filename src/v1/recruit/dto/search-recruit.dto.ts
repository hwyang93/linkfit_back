import { ApiProperty } from '@nestjs/swagger';

export class SearchRecruitDto {
  @ApiProperty({ description: '직무', required: false })
  fields: string[];

  @ApiProperty({ description: '수업시간', required: false })
  times: string[];

  @ApiProperty({ description: '채용형태', required: false })
  recruitTypes: string[];

  @ApiProperty({ description: '지역', required: true })
  area: string;

  @ApiProperty({ description: '본인이 작성한 게시글 여부', default: 'N', required: false })
  isWriter: string;
}
