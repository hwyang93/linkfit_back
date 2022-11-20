import {DataSource} from "typeorm";
import {Member} from "./src/entites/Member";
import {CommonFile} from "./src/entites/CommonFile";
import {Company} from "./src/entites/Company";
import {MemberAlbum} from "./src/entites/MemberAlbum";
import {MemberBlock} from "./src/entites/MemberBlock";
import {MemberLicence} from "./src/entites/MemberLicence";
import {MemberReputation} from "./src/entites/MemberReputation";

const dataSource = new DataSource({
    type: 'mysql',
    host: '192.168.0.25',
    port: 3306,
    username: 'linkfit',
    password: 'linkfit',
    database: 'linkfit',
    entities: [Member, CommonFile, Company,MemberAlbum, MemberBlock, MemberLicence, MemberReputation,
    ],
    migrations: [__dirname + '/src/migrations/*.ts'],
    charset: 'utf8mb4',
    synchronize: false,
    logging: true,
});

export default dataSource;