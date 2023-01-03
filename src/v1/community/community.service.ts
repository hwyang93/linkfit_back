import { Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunityService {
  create(createCommunityDto: CreateCommunityDto) {
    return 'This action adds a new community';
  }

  findAll() {
    return `This action returns all community`;
  }

  findOne(id: number) {
    return `This action returns a #${id} community`;
  }

  update(id: number, updateCommunityDto: UpdateCommunityDto) {
    return `This action updates a #${id} community`;
  }

  remove(id: number) {
    return `This action removes a #${id} community`;
  }
}
