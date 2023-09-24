import { Injectable } from "@nestjs/common";
import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability"
import { User } from "src/user/schema/user.schema";
import { Role, RoleName } from "src/role/schema/role.schema";
import { UserToken } from "src/usertoken/schema/usertoken.schema";
import { Bill } from "src/bill/schema/bill.schema";
import { Userotp } from "src/userotp/schema/userotp.schema";
import { Cart } from "src/cart/schema/cart.schema";
import { Store } from "src/store/schema/store.schema";
import { Feedback } from "src/feedback/schema/feedback.schema";
import { Product } from "src/product/schema/product.schema";
import { Evaluation } from "src/evaluation/schema/evaluation.schema";
import { ApiConflictResponse } from "@nestjs/swagger";

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
    typeof Bill |
    typeof Cart |
    typeof Store |
    typeof Feedback |
    typeof Product |
    typeof Evaluation

> | 'all'

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
    defineAbility(role: string) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

        switch (role) {
            case RoleName.ADMIN:
                can(Action.Manage, 'all')
                break
            case RoleName.USER:
                can(Action.Manage, UserToken)
                can(Action.Manage, Bill)
                can(Action.Manage, Cart)
                can(Action.Create, Store)
                can(Action.Read, Store)
                can(Action.Create, Feedback)
                can(Action.Update, Evaluation)
                can(Action.Read, User)
                cannot(Action.Read, Role).because('Không cho đọc role!')
                cannot(Action.Create, Product).because('Không cho tạo sản phẩm!')
                break
            case RoleName.SELLER:
                can(Action.Manage, Store)
                can(Action.Manage, Product)
                break
            case RoleName.MANAGER:
                break
            default:
                break
        }

        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
        })

    }
}
