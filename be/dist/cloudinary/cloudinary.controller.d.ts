/// <reference types="multer" />
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SuccessResponse } from '../core/success.response';
export declare class CloudinaryController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(file: Express.Multer.File): Promise<SuccessResponse>;
}
