import { ApiProperty } from '@nestjs/swagger';
import { RegionAuth } from '../../../entites/RegionAuth';

export class CreateRegionAuthDto {
  @ApiProperty({ description: '경도' })
  lon: number;

  @ApiProperty({ description: '위도' })
  lat: number;

  @ApiProperty({ description: '주소' })
  address: string;

  toEntity() {
    const entity = new RegionAuth();
    entity.lon = this.lon;
    entity.lat = this.lat;
    entity.address = this.address;
    return entity;
  }
}
