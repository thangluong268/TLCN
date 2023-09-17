import { SetMetadata } from "@nestjs/common";
import { Action, Subjects } from "../ability.factory";
import { Role } from "src/role/schema/role.schema";
import { UserToken } from "src/auth/schema/usertoken.schema";
import { User } from "src/user/schema/user.schema";


export interface RequiredRule {
    action: Action;
    subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) => SetMetadata(CHECK_ABILITY, requirements)

// Role
export class ReadRoleAbility implements RequiredRule {
    action = Action.Read;
    subject = Role;
}

export class CreateRoleAbility implements RequiredRule {
    action = Action.Create;
    subject = Role;
}

// User
export class CreateUserAbility implements RequiredRule {
    action = Action.Create;
    subject = User;
}

// UserToken
export class ManageUserTokenAbility implements RequiredRule {
    action = Action.Manage;
    subject = UserToken;
}