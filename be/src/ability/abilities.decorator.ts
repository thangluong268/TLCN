import { SetMetadata } from "@nestjs/common";
import { Action, Subjects } from "./ability.factory";
import { Role } from "src/role/schema/role.schema";


export interface RequiredRule {
    action: Action;
    subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) => SetMetadata(CHECK_ABILITY, requirements)

export class ReadRoleAbility implements RequiredRule {
    action = Action.Read;
    subject = Role;
}