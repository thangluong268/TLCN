import { Bill } from '../..//bill/schema/bill.schema';
import { Cart } from '../..//cart/schema/cart.schema';
import { Category } from '../..//category/schema/category.schema';
import { Evaluation } from '../..//evaluation/schema/evaluation.schema';
import { Feedback } from '../..//feedback/schema/feedback.schema';
import { Notification } from '../..//notification/schema/notification.schema';
import { Product } from '../..//product/schema/product.schema';
import { Promotion } from '../..//promotion/schema/promotion.schema';
import { Store } from '../..//store/schema/store.schema';
import { User } from '../..//user/schema/user.schema';
import { Userotp } from '../..//userotp/schema/userotp.schema';
import { UserToken } from '../..//usertoken/schema/usertoken.schema';
import { Role } from '../../role/schema/role.schema';
import { Action, Subjects } from '../ability.factory';
export interface RequiredRule {
    action: Action;
    subject: Subjects;
}
export declare const CHECK_ABILITY = "check_ability";
export declare const CheckAbilities: (...requirements: RequiredRule[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class ReadRoleAbility implements RequiredRule {
    action: Action;
    subject: typeof Role;
}
export declare class UpdateRoleAbility implements RequiredRule {
    action: Action;
    subject: typeof Role;
}
export declare class CreateRoleAbility implements RequiredRule {
    action: Action;
    subject: typeof Role;
}
export declare class CreateUserAbility implements RequiredRule {
    action: Action;
    subject: typeof User;
}
export declare class ReadUserAbility implements RequiredRule {
    action: Action;
    subject: typeof User;
}
export declare class UpdateUserAbility implements RequiredRule {
    action: Action;
    subject: typeof User;
}
export declare class DeleteUserAbility implements RequiredRule {
    action: Action;
    subject: typeof User;
}
export declare class CreateUserotpAbility implements RequiredRule {
    action: Action;
    subject: typeof Userotp;
}
export declare class ManageUserTokenAbility implements RequiredRule {
    action: Action;
    subject: typeof UserToken;
}
export declare class CreateBillAbility implements RequiredRule {
    action: Action;
    subject: typeof Bill;
}
export declare class ReadBillAbility implements RequiredRule {
    action: Action;
    subject: typeof Bill;
}
export declare class UpdateBillAbility implements RequiredRule {
    action: Action;
    subject: typeof Bill;
}
export declare class CreateCartAbility implements RequiredRule {
    action: Action;
    subject: typeof Cart;
}
export declare class ReadCartAbility implements RequiredRule {
    action: Action;
    subject: typeof Cart;
}
export declare class UpdateCartAbility implements RequiredRule {
    action: Action;
    subject: typeof Cart;
}
export declare class CreateStoreAbility implements RequiredRule {
    action: Action;
    subject: typeof Store;
}
export declare class ReadStoreAbility implements RequiredRule {
    action: Action;
    subject: typeof Store;
}
export declare class DeleteStoreAbility implements RequiredRule {
    action: Action;
    subject: typeof Store;
}
export declare class UpdateStoreAbility implements RequiredRule {
    action: Action;
    subject: typeof Store;
}
export declare class ManageStoreAbility implements RequiredRule {
    action: Action;
    subject: typeof Store;
}
export declare class CreateFeedBackAbility implements RequiredRule {
    action: Action;
    subject: typeof Feedback;
}
export declare class UpdateFeedBackAbility implements RequiredRule {
    action: Action;
    subject: typeof Feedback;
}
export declare class CreateProductAbility implements RequiredRule {
    action: Action;
    subject: typeof Product;
}
export declare class ReadProductAbility implements RequiredRule {
    action: Action;
    subject: typeof Product;
}
export declare class UpdateProductAbility implements RequiredRule {
    action: Action;
    subject: typeof Product;
}
export declare class DeleteProductAbility implements RequiredRule {
    action: Action;
    subject: typeof Product;
}
export declare class UpdateEvaluationAbility implements RequiredRule {
    action: Action;
    subject: typeof Evaluation;
}
export declare class ReadNotificationAbility implements RequiredRule {
    action: Action;
    subject: typeof Notification;
}
export declare class UpdateNotificationAbility implements RequiredRule {
    action: Action;
    subject: typeof Notification;
}
export declare class CreatePromotionAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class ReadPromotionAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class UpdatePromotionAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class DeletePromotionAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class CreateFineAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class ReadFineAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class UpdateFineAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class DeleteFineAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class CreatePolicyAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class ReadPolicyAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class UpdatePolicyAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class DeletePolicyAbility implements RequiredRule {
    action: Action;
    subject: typeof Promotion;
}
export declare class CreateCategoryAbility implements RequiredRule {
    action: Action;
    subject: typeof Category;
}
export declare class ReadCategoryAbility implements RequiredRule {
    action: Action;
    subject: typeof Category;
}
