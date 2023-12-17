import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { SuccessResponse } from '../core/success.response';
import { NotFoundException } from '../core/error.response';
export declare class PolicyController {
    private policyService;
    constructor(policyService: PolicyService);
    create(createPolicyDto: CreatePolicyDto): Promise<SuccessResponse>;
    findAll(): Promise<SuccessResponse>;
    update(id: string, updateFineDto: CreatePolicyDto): Promise<SuccessResponse | NotFoundException>;
    remove(id: string): Promise<SuccessResponse | NotFoundException>;
}
