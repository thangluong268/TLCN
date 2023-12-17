import { SetMetadata } from '@nestjs/common';
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

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) => SetMetadata(CHECK_ABILITY, requirements);

// Role
export class ReadRoleAbility implements RequiredRule {
  action = Action.Read;
  subject = Role;
}

export class UpdateRoleAbility implements RequiredRule {
  action = Action.Update;
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

export class ReadUserAbility implements RequiredRule {
  action = Action.Read;
  subject = User;
}

export class UpdateUserAbility implements RequiredRule {
  action = Action.Update;
  subject = User;
}

export class DeleteUserAbility implements RequiredRule {
  action = Action.Delete;
  subject = User;
}

// Userotp
export class CreateUserotpAbility implements RequiredRule {
  action = Action.Create;
  subject = Userotp;
}

// UserToken
export class ManageUserTokenAbility implements RequiredRule {
  action = Action.Manage;
  subject = UserToken;
}

// Bill
export class CreateBillAbility implements RequiredRule {
  action = Action.Create;
  subject = Bill;
}

export class ReadBillAbility implements RequiredRule {
  action = Action.Read;
  subject = Bill;
}

export class UpdateBillAbility implements RequiredRule {
  action = Action.Update;
  subject = Bill;
}

// Cart
export class CreateCartAbility implements RequiredRule {
  action = Action.Create;
  subject = Cart;
}

export class ReadCartAbility implements RequiredRule {
  action = Action.Read;
  subject = Cart;
}

export class UpdateCartAbility implements RequiredRule {
  action = Action.Update;
  subject = Cart;
}

// Store
export class CreateStoreAbility implements RequiredRule {
  action = Action.Create;
  subject = Store;
}

export class ReadStoreAbility implements RequiredRule {
  action = Action.Read;
  subject = Store;
}

export class DeleteStoreAbility implements RequiredRule {
  action = Action.Delete;
  subject = Store;
}

export class UpdateStoreAbility implements RequiredRule {
  action = Action.Update;
  subject = Store;
}

export class ManageStoreAbility implements RequiredRule {
  action = Action.Manage;
  subject = Store;
}

// Feedback
export class CreateFeedBackAbility implements RequiredRule {
  action = Action.Create;
  subject = Feedback;
}

export class UpdateFeedBackAbility implements RequiredRule {
  action = Action.Update;
  subject = Feedback;
}

// Product
export class CreateProductAbility implements RequiredRule {
  action = Action.Create;
  subject = Product;
}

export class ReadProductAbility implements RequiredRule {
  action = Action.Read;
  subject = Product;
}

export class UpdateProductAbility implements RequiredRule {
  action = Action.Update;
  subject = Product;
}
export class DeleteProductAbility implements RequiredRule {
  action = Action.Delete;
  subject = Product;
}

// Evaluation
export class UpdateEvaluationAbility implements RequiredRule {
  action = Action.Update;
  subject = Evaluation;
}

// Notification
export class ReadNotificationAbility implements RequiredRule {
  action = Action.Read;
  subject = Notification;
}

export class UpdateNotificationAbility implements RequiredRule {
  action = Action.Update;
  subject = Notification;
}

//Promotion
export class CreatePromotionAbility implements RequiredRule {
  action = Action.Create;
  subject = Promotion;
}

export class ReadPromotionAbility implements RequiredRule {
  action = Action.Read;
  subject = Promotion;
}

export class UpdatePromotionAbility implements RequiredRule {
  action = Action.Update;
  subject = Promotion;
}

export class DeletePromotionAbility implements RequiredRule {
  action = Action.Delete;
  subject = Promotion;
}

// Fine
export class CreateFineAbility implements RequiredRule {
  action = Action.Create;
  subject = Promotion;
}

export class ReadFineAbility implements RequiredRule {
  action = Action.Read;
  subject = Promotion;
}

export class UpdateFineAbility implements RequiredRule {
  action = Action.Update;
  subject = Promotion;
}

export class DeleteFineAbility implements RequiredRule {
  action = Action.Delete;
  subject = Promotion;
}

//Policy
export class CreatePolicyAbility implements RequiredRule {
  action = Action.Create;
  subject = Promotion;
}

export class ReadPolicyAbility implements RequiredRule {
  action = Action.Read;
  subject = Promotion;
}

export class UpdatePolicyAbility implements RequiredRule {
  action = Action.Update;
  subject = Promotion;
}

export class DeletePolicyAbility implements RequiredRule {
  action = Action.Delete;
  subject = Promotion;
}

//Category
export class CreateCategoryAbility implements RequiredRule {
  action = Action.Create;
  subject = Category;
}

export class ReadCategoryAbility implements RequiredRule {
  action = Action.Read;
  subject = Category;
}
