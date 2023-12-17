/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { Userotp } from './schema/userotp.schema';
export declare class UserotpService {
    private mailService;
    private userotpModel;
    constructor(mailService: MailerService, userotpModel: Model<Userotp>);
    sendotp(email: string): Promise<string>;
    create(email: string, otp: string): Promise<Userotp>;
    update(email: string, otp: string): Promise<Boolean>;
    findUserotpByEmail(email: string): Promise<any>;
    checkotp(otp: Number, email: string): Promise<boolean>;
    deleteotp(email: string): Promise<any>;
}
