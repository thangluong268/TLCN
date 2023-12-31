import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Report } from '../report/schema/report.schema';
import { Bill } from '../bill/schema/bill.schema';
import { Cart } from '../cart/schema/cart.schema';
import { Category } from '../category/schema/category.schema';
import { Evaluation } from '../evaluation/schema/evaluation.schema';
import { Feedback } from '../feedback/schema/feedback.schema';
import { Notification } from '../notification/schema/notification.schema';
import { Product } from '../product/schema/product.schema';
import { Promotion } from '../promotion/schema/promotion.schema';
import { Role, RoleName } from '../role/schema/role.schema';
import { Store } from '../store/schema/store.schema';
import { User } from '../user/schema/user.schema';
import { Userotp } from '../userotp/schema/userotp.schema';
import { UserToken } from '../usertoken/schema/usertoken.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Orther = 'orther',
}

export type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Userotp
      | typeof Role
      | typeof UserToken
      | typeof Bill
      | typeof Cart
      | typeof Store
      | typeof Feedback
      | typeof Product
      | typeof Evaluation
      | typeof Notification
      | typeof Promotion
      | typeof Category
      | typeof Report
    >
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(role: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    switch (role) {
      case RoleName.ADMIN:
        can(Action.Manage, 'all');
        break;
      case RoleName.USER:
        can(Action.Manage, UserToken);
        can(Action.Manage, Bill);
        can(Action.Manage, Cart);
        can(Action.Create, Store);
        can(Action.Read, Store);
        can(Action.Read, User);
        can(Action.Update, User);
        can(Action.Delete, User);
        can(Action.Manage, Feedback);
        can(Action.Update, Evaluation);
        can(Action.Read, Evaluation);
        can(Action.Manage, Notification);
        can(Action.Manage, Promotion);
        can(Action.Create, Report);
        cannot(Action.Read, Role).because('Không cho đọc role!');
        cannot(Action.Create, Product).because('Không cho tạo sản phẩm!');
        break;
      case RoleName.SELLER:
        can(Action.Manage, UserToken);
        can(Action.Read, Bill);
        can(Action.Update, Bill);
        can(Action.Manage, Store);
        can(Action.Manage, Product);
        can(Action.Manage, Notification);
        break;
      case RoleName.MANAGER_USER:
        can(Action.Manage, UserToken);
        can(Action.Manage, User);
        break;
      case RoleName.MANAGER_PRODUCT:
        can(Action.Manage, Product);
        can(Action.Manage, Report);
        can(Action.Manage, Category);
        break;
      case RoleName.MANAGER_STORE:
        can(Action.Manage, Store);
        can(Action.Manage, Report);
        break;
      default:
        break;
    }
    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
