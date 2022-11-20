import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Member} from "./entites/Member";
import {CommonFile} from "./entites/CommonFile";
import {Company} from "./entites/Company";
import {MemberAlbum} from "./entites/MemberAlbum";
import {MemberBlock} from "./entites/MemberBlock";
import {MemberLicence} from "./entites/MemberLicence";
import {MemberReputation} from "./entites/MemberReputation";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '192.168.0.25',
    port: 3306,
    username: 'linkfit',
    password: 'linkfit',
    database: 'linkfit',
    entities: [Member, CommonFile, Company,MemberAlbum, MemberBlock, MemberLicence, MemberReputation],
    charset: 'utf8mb4',
    synchronize: true,
    logging: true,
    keepConnectionAlive: true
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
