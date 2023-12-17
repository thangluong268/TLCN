import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { SuccessResponse } from '../core/success.response';
import { NotFoundException } from '../core/error.response';
export declare class FineController {
    private readonly fineService;
    constructor(fineService: FineService);
    create(createFineDto: CreateFineDto): Promise<SuccessResponse>;
    findAll(): Promise<SuccessResponse>;
    update(id: string, updateFineDto: CreateFineDto): Promise<SuccessResponse | NotFoundException>;
    remove(id: string): Promise<SuccessResponse | NotFoundException>;
}
