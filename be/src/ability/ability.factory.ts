import { Injectable } from "@nestjs/common";
import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability"
import { User } from "src/user/schema/user.schema";
import { Role, RoleName } from "src/role/schema/role.schema";
import { UserToken } from "src/usertoken/schema/usertoken.schema";
import { Bill } from "src/bill/schema/bill.schema";
import { Userotp } from "src/userotp/schema/userotp.schema";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

export type Subjects = InferSubjects<
    typeof User | typeof Userotp |
    typeof Role |
    typeof UserToken |
    typeof Bill

> | 'all'

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
    defineAbility(role: string) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

        if (role === RoleName.ADMIN) {
            can(Action.Manage, 'all')
        }
        else if (role === RoleName.USER) {
            can(Action.Manage, UserToken)
            can(Action.Manage, Bill)
            can(Action.Manage, User)
            can(Action.Manage, Userotp)
            cannot(Action.Read, Role).because('tao ko cho may doc role')
        }

        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
        })

    }
}
