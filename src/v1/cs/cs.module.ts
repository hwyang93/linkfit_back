import { Module } from '@nestjs/common';
import { CsService } from './cs.service';
import { CsController } from './cs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cs } from '../../entites/Cs';

@Module({
  imports: [TypeOrmModule.forFeature([Cs])],
  controllers: [CsController],
  providers: [CsService]
})
export class CsModule {}
