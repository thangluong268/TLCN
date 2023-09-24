import { SetMetadata } from "@nestjs/common";
import { Action, Subjects } from "../ability.factory";
import { Role } from "src/role/schema/role.schema";
import { UserToken } from "src/usertoken/schema/usertoken.schema";
import { User } from "src/user/schema/user.schema";
import { Bill } from "src/bill/schema/bill.schema";

import { Userotp } from "src/userotp/schema/userotp.schema";

import { Cart } from "src/cart/schema/cart.schema";
import { Store } from "src/store/schema/store.schema";
import { Feedback } from "src/feedback/schema/feedback.schema";
import { Product } from "src/product/schema/product.schema";
import { Evaluation } from "src/evaluation/schema/evaluation.schema";



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


// Cart
export class CreateCartAbility implements RequiredRule {
    action = Action.Create;
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


// Feedback
export class CreateFeedBackAbility implements RequiredRule {
    action = Action.Create;
    subject = Feedback;
}


// Product
export class CreateProductAbility implements RequiredRule {
    action = Action.Create;
    subject = Product;
}


// Evaluation
export class UpdateEvaluationAbility implements RequiredRule {
    action = Action.Update;
    subject = Evaluation;
}



