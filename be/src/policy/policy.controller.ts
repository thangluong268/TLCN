import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { Policy } from './schema/policy.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('policy')
@ApiTags('Policy')
@ApiBearerAuth('Authorization')
export class PolicyController {
    constructor(
        private policyService: PolicyService,
    ) { }

    @Get('getAll')
    async getAll(): Promise<Policy[]> {
        const policys = await this.policyService.getAll()
        return policys
    }

    @Post('create')
    async create(
        @Body()
        policy: CreatePolicyDto
    ): Promise<Policy> {
        return this.policyService.create(policy)
    }

    @Get('getById/:id')
    async getById(
        @Param('id')
        id: string
    ): Promise<Policy> {
        return this.policyService.getById(id)
    }

}
