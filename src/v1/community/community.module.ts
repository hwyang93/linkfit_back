import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from '../../entites/Community';
import { CommunityComment } from '../../entites/CommunityComment';
import { CommunityFavorite } from '../../entites/CommunityFavorite';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityComment, CommunityFavorite])],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule {}
