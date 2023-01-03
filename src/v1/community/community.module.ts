import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from '../../entites/Community';

@Module({
  imports: [TypeOrmModule.forFeature([Community])],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule {}
