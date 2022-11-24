import {ApiProperty} from "@nestjs/swagger";

export class SearchRecruitDto {

    @ApiProperty({description: '직무', required: false})
    field: string;

    @ApiProperty({description: '수업시간', required: false})
    time: string;

    @ApiProperty({description: '채용형태', required: false})
    recruitType: string;
}