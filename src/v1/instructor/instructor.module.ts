import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [InstructorController],
  providers: [InstructorService]
})
export class InstructorModule {}
