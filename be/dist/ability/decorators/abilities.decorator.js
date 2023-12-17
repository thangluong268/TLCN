"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadCategoryAbility = exports.CreateCategoryAbility = exports.DeletePolicyAbility = exports.UpdatePolicyAbility = exports.ReadPolicyAbility = exports.CreatePolicyAbility = exports.DeleteFineAbility = exports.UpdateFineAbility = exports.ReadFineAbility = exports.CreateFineAbility = exports.DeletePromotionAbility = exports.UpdatePromotionAbility = exports.ReadPromotionAbility = exports.CreatePromotionAbility = exports.UpdateNotificationAbility = exports.ReadNotificationAbility = exports.UpdateEvaluationAbility = exports.DeleteProductAbility = exports.UpdateProductAbility = exports.ReadProductAbility = exports.CreateProductAbility = exports.UpdateFeedBackAbility = exports.CreateFeedBackAbility = exports.ManageStoreAbility = exports.UpdateStoreAbility = exports.DeleteStoreAbility = exports.ReadStoreAbility = exports.CreateStoreAbility = exports.UpdateCartAbility = exports.ReadCartAbility = exports.CreateCartAbility = exports.UpdateBillAbility = exports.ReadBillAbility = exports.CreateBillAbility = exports.ManageUserTokenAbility = exports.CreateUserotpAbility = exports.DeleteUserAbility = exports.UpdateUserAbility = exports.ReadUserAbility = exports.CreateUserAbility = exports.CreateRoleAbility = exports.UpdateRoleAbility = exports.ReadRoleAbility = exports.CheckAbilities = exports.CHECK_ABILITY = void 0;
const common_1 = require("@nestjs/common");
const bill_schema_1 = require("../..//bill/schema/bill.schema");
const cart_schema_1 = require("../..//cart/schema/cart.schema");
const category_schema_1 = require("../..//category/schema/category.schema");
const evaluation_schema_1 = require("../..//evaluation/schema/evaluation.schema");
const feedback_schema_1 = require("../..//feedback/schema/feedback.schema");
const notification_schema_1 = require("../..//notification/schema/notification.schema");
const product_schema_1 = require("../..//product/schema/product.schema");
const promotion_schema_1 = require("../..//promotion/schema/promotion.schema");
const store_schema_1 = require("../..//store/schema/store.schema");
const user_schema_1 = require("../..//user/schema/user.schema");
const userotp_schema_1 = require("../..//userotp/schema/userotp.schema");
const usertoken_schema_1 = require("../..//usertoken/schema/usertoken.schema");
const role_schema_1 = require("../../role/schema/role.schema");
const ability_factory_1 = require("../ability.factory");
exports.CHECK_ABILITY = 'check_ability';
const CheckAbilities = (...requirements) => (0, common_1.SetMetadata)(exports.CHECK_ABILITY, requirements);
exports.CheckAbilities = CheckAbilities;
class ReadRoleAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = role_schema_1.Role;
    }
}
exports.ReadRoleAbility = ReadRoleAbility;
class UpdateRoleAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = role_schema_1.Role;
    }
}
exports.UpdateRoleAbility = UpdateRoleAbility;
class CreateRoleAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = role_schema_1.Role;
    }
}
exports.CreateRoleAbility = CreateRoleAbility;
class CreateUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = user_schema_1.User;
    }
}
exports.CreateUserAbility = CreateUserAbility;
class ReadUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = user_schema_1.User;
    }
}
exports.ReadUserAbility = ReadUserAbility;
class UpdateUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = user_schema_1.User;
    }
}
exports.UpdateUserAbility = UpdateUserAbility;
class DeleteUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = user_schema_1.User;
    }
}
exports.DeleteUserAbility = DeleteUserAbility;
class CreateUserotpAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = userotp_schema_1.Userotp;
    }
}
exports.CreateUserotpAbility = CreateUserotpAbility;
class ManageUserTokenAbility {
    constructor() {
        this.action = ability_factory_1.Action.Manage;
        this.subject = usertoken_schema_1.UserToken;
    }
}
exports.ManageUserTokenAbility = ManageUserTokenAbility;
class CreateBillAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = bill_schema_1.Bill;
    }
}
exports.CreateBillAbility = CreateBillAbility;
class ReadBillAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = bill_schema_1.Bill;
    }
}
exports.ReadBillAbility = ReadBillAbility;
class UpdateBillAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = bill_schema_1.Bill;
    }
}
exports.UpdateBillAbility = UpdateBillAbility;
class CreateCartAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = cart_schema_1.Cart;
    }
}
exports.CreateCartAbility = CreateCartAbility;
class ReadCartAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = cart_schema_1.Cart;
    }
}
exports.ReadCartAbility = ReadCartAbility;
class UpdateCartAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = cart_schema_1.Cart;
    }
}
exports.UpdateCartAbility = UpdateCartAbility;
class CreateStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = store_schema_1.Store;
    }
}
exports.CreateStoreAbility = CreateStoreAbility;
class ReadStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = store_schema_1.Store;
    }
}
exports.ReadStoreAbility = ReadStoreAbility;
class DeleteStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = store_schema_1.Store;
    }
}
exports.DeleteStoreAbility = DeleteStoreAbility;
class UpdateStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = store_schema_1.Store;
    }
}
exports.UpdateStoreAbility = UpdateStoreAbility;
class ManageStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Manage;
        this.subject = store_schema_1.Store;
    }
}
exports.ManageStoreAbility = ManageStoreAbility;
class CreateFeedBackAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = feedback_schema_1.Feedback;
    }
}
exports.CreateFeedBackAbility = CreateFeedBackAbility;
class UpdateFeedBackAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = feedback_schema_1.Feedback;
    }
}
exports.UpdateFeedBackAbility = UpdateFeedBackAbility;
class CreateProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = product_schema_1.Product;
    }
}
exports.CreateProductAbility = CreateProductAbility;
class ReadProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = product_schema_1.Product;
    }
}
exports.ReadProductAbility = ReadProductAbility;
class UpdateProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = product_schema_1.Product;
    }
}
exports.UpdateProductAbility = UpdateProductAbility;
class DeleteProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = product_schema_1.Product;
    }
}
exports.DeleteProductAbility = DeleteProductAbility;
class UpdateEvaluationAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = evaluation_schema_1.Evaluation;
    }
}
exports.UpdateEvaluationAbility = UpdateEvaluationAbility;
class ReadNotificationAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = notification_schema_1.Notification;
    }
}
exports.ReadNotificationAbility = ReadNotificationAbility;
class UpdateNotificationAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = notification_schema_1.Notification;
    }
}
exports.UpdateNotificationAbility = UpdateNotificationAbility;
class CreatePromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.CreatePromotionAbility = CreatePromotionAbility;
class ReadPromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.ReadPromotionAbility = ReadPromotionAbility;
class UpdatePromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.UpdatePromotionAbility = UpdatePromotionAbility;
class DeletePromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.DeletePromotionAbility = DeletePromotionAbility;
class CreateFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.CreateFineAbility = CreateFineAbility;
class ReadFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.ReadFineAbility = ReadFineAbility;
class UpdateFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.UpdateFineAbility = UpdateFineAbility;
class DeleteFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.DeleteFineAbility = DeleteFineAbility;
class CreatePolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.CreatePolicyAbility = CreatePolicyAbility;
class ReadPolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.ReadPolicyAbility = ReadPolicyAbility;
class UpdatePolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.UpdatePolicyAbility = UpdatePolicyAbility;
class DeletePolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.DeletePolicyAbility = DeletePolicyAbility;
class CreateCategoryAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = category_schema_1.Category;
    }
}
exports.CreateCategoryAbility = CreateCategoryAbility;
class ReadCategoryAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = category_schema_1.Category;
    }
}
exports.ReadCategoryAbility = ReadCategoryAbility;
//# sourceMappingURL=abilities.decorator.js.map