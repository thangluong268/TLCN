/// <reference types="multer" />
import { CloudinaryResponse } from '../responses/cloudinary.response';
export declare class CloudinaryService {
    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse>;
}
