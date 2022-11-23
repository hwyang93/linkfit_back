import {Member} from "../../entites/Member";
import {RecruitDate} from "../../entites/RecruitDate";

export class CreateRecruitDto {
    seq: number;

    companyName: string;

    address: string;

    district: string;

    phone: string;

    recruitType: string;

    career: string;

    education: string;

    payType: string;

    pay: string;

    classType: string;

    content: string;

    status: string;

    writer: Member;

    dates: RecruitDate[];
}
