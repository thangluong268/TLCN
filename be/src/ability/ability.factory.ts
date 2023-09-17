import { Injectable } from "@nestjs/common";
import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability"
import { User } from "src/user/schema/user.schema";
import { Role, RoleName } from "src/role/schema/role.schema";
import { UserToken } from "src/auth/schema/usertoken.schema";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

export type Subjects = InferSubjects<
    typeof User |
    typeof Role |
    typeof UserToken

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
            cannot(Action.Read, Role).because('tao ko cho may doc role')
        }

        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
        })

    }
}
