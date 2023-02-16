import { ApiProperty } from '@nestjs/swagger';
import { RegionAuth } from '../../../entites/RegionAuth';

export class CreateRegionAuthDto {
  @ApiProperty({ description: '경도' })
  lon: number;

  @ApiProperty({ description: '위도' })
  lat: number;

  @ApiProperty({ description: '시도 단위' })
  region1depth: string;

  @ApiProperty({ description: '시구 단위' })
  region2depth: string;

  @ApiProperty({ description: '동단위' })
  region3depth: string;

  toEntity() {
    const entity = new RegionAuth();
    entity.lon = this.lon;
    entity.lat = this.lat;
    entity.region1depth = this.region1depth;
    entity.region2depth = this.region2depth;
    entity.region3depth = this.region3depth;
    return entity;
  }
}
