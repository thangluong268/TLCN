import { InferSubjects, MongoAbility } from '@casl/ability';
import { Bill } from '../bill/schema/bill.schema';
import { Cart } from '../cart/schema/cart.schema';
import { Category } from '../category/schema/category.schema';
import { Evaluation } from '../evaluation/schema/evaluation.schema';
import { Feedback } from '../feedback/schema/feedback.schema';
import { Notification } from '../notification/schema/notification.schema';
import { Product } from '../product/schema/product.schema';
import { Promotion } from '../promotion/schema/promotion.schema';
import { Role } from '../role/schema/role.schema';
import { Store } from '../store/schema/store.schema';
import { User } from '../user/schema/user.schema';
import { Userotp } from '../userotp/schema/userotp.schema';
import { UserToken } from '../usertoken/schema/usertoken.schema';
export declare enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
    Orther = "orther"
}
export type Subjects = InferSubjects<typeof User | typeof Userotp | typeof Role | typeof UserToken | typeof Bill | typeof Cart | typeof Store | typeof Feedback | typeof Product | typeof Evaluation | typeof Notification | typeof Promotion | typeof Category> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;
export declare class AbilityFactory {
    defineAbility(role: string): AppAbility;
}
