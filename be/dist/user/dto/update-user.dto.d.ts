import { AddressProfileDto } from './address-profile.dto';
export declare class UpdateUserDto {
    avatar: string;
    fullName: string;
    address: AddressProfileDto[];
    phone: string;
    gender: string;
    birthday: Date;
    wallet: number;
    status: boolean;
}
