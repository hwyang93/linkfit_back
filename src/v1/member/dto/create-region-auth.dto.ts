import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionAuthDto {
  @ApiProperty({ description: '경도' })
  lon: number;

  @ApiProperty({ description: '위도' })
  lat: number;

  @ApiProperty({ description: '주소' })
  address: string;
}
