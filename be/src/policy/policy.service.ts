import { HttpStatus, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Policy } from './schema/policy.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PolicyNotFoundException } from './exceptions/PolicyNotFound.exception';

@Injectable()
export class PolicyService {
    constructor(
        @InjectModel(Policy.name)
        private policyModel: mongoose.Model<Policy>,
    ) { }

    async getAll(): Promise<Policy[]> {
        console.log(test)
        const policys = await this.policyModel.find()
        return policys
    }

    async create(policy: Policy): Promise<Policy> {
        const newPolicy = await this.policyModel.create(policy)
        return newPolicy
    }

    async getById(id: string): Promise<Policy> {
        const policy = await this.policyModel.findById(id)
        if(!policy) { throw new PolicyNotFoundException(id) }
        return policy
    }
}
