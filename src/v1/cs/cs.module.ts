import { Module } from '@nestjs/common';
import { CsService } from './cs.service';
import { CsController } from './cs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cs } from '../../entites/Cs';
import { Inquiry } from '../../entites/Inquiry';

@Module({
  imports: [TypeOrmModule.forFeature([Cs, Inquiry])],
  controllers: [CsController],
  providers: [CsService]
})
export class CsModule {}
