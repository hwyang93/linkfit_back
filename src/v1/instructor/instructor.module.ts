import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { PositionSuggest } from '../../entites/PositionSuggest';
import { MemberFavorite } from '../../entites/MemberFavorite';

@Module({
  imports: [TypeOrmModule.forFeature([Member, PositionSuggest, MemberFavorite])],
  controllers: [InstructorController],
  providers: [InstructorService]
})
export class InstructorModule {}
