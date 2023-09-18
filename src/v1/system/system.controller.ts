import { Controller, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { SystemService } from './system.service';
import { ApiOperation } from '@nestjs/swagger';
import axios from 'axios';
import { convertRegionMainCode, convertRegionMainName, convertRegionMiddleCode } from '../../common/utils/utils';
import { orderBy } from 'lodash';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @ApiOperation({ summary: '특별/광역시, 도 목록 조회' })
  @Get('region')
  async getMainRegion() {
    let regionCode;
    await axios
      .get(`https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=*00000000`, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(({ data }: any) => {
        regionCode = data.regcodes.map(region => {
          return { code: convertRegionMainCode(region.code), name: convertRegionMainName(region.name) };
        });
      })
      .catch(() => {
        throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
      });

    return regionCode;
  }

  @ApiOperation({ summary: '동 목록 조회' })
  @Get('region/:mainCode/:middleCode')
  async getSubRegion(@Param('mainCode', ParseIntPipe) mainCode: number, @Param('middleCode', ParseIntPipe) middleCode: number) {
    let regionCode;
    await axios
      .get(`https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=${mainCode}${middleCode}*&is_ignore_zero=false`, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(({ data }: any) => {
        regionCode = data.regcodes;
      })
      .catch(() => {
        throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
      });

    return regionCode;
  }

  @ApiOperation({ summary: '구/시 목록 조회' })
  @Get('region/:mainCode')
  async getMiddleRegion(@Param('mainCode', ParseIntPipe) mainCode: number) {
    let regionCode;
    await axios
      .get(`https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=${mainCode}*00000&is_ignore_zero=false`, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(({ data }: any) => {
        regionCode = data.regcodes.map(region => {
          return { code: convertRegionMiddleCode(region.code), name: region.name.replace(data.regcodes[0].name, '').trim() };
        });
        regionCode.shift();
        regionCode = orderBy(regionCode, 'name', 'asc');
      })
      .catch(() => {
        throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
      });

    return regionCode;
  }
}
