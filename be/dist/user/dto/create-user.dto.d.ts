import { AddressProfileDto } from "./address-profile.dto";
export declare class CreateUserDto {
    avatar: string;
    fullName: string;
    email: string;
    password: string;
    address: AddressProfileDto[];
    phone: string;
    gender: string;
    birthday: Date;
    friends: String[];
    followStores: String[];
    warningCount: number;
    status: boolean;
}
