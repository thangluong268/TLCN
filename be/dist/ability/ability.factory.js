"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityFactory = exports.Action = void 0;
const ability_1 = require("@casl/ability");
const common_1 = require("@nestjs/common");
const bill_schema_1 = require("../bill/schema/bill.schema");
const cart_schema_1 = require("../cart/schema/cart.schema");
const evaluation_schema_1 = require("../evaluation/schema/evaluation.schema");
const feedback_schema_1 = require("../feedback/schema/feedback.schema");
const notification_schema_1 = require("../notification/schema/notification.schema");
const product_schema_1 = require("../product/schema/product.schema");
const promotion_schema_1 = require("../promotion/schema/promotion.schema");
const role_schema_1 = require("../role/schema/role.schema");
const store_schema_1 = require("../store/schema/store.schema");
const user_schema_1 = require("../user/schema/user.schema");
const usertoken_schema_1 = require("../usertoken/schema/usertoken.schema");
var Action;
(function (Action) {
    Action["Manage"] = "manage";
    Action["Create"] = "create";
    Action["Read"] = "read";
    Action["Update"] = "update";
    Action["Delete"] = "delete";
    Action["Orther"] = "orther";
})(Action || (exports.Action = Action = {}));
let AbilityFactory = class AbilityFactory {
    defineAbility(role) {
        const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
        switch (role) {
            case role_schema_1.RoleName.ADMIN:
                can(Action.Manage, 'all');
                break;
            case role_schema_1.RoleName.USER:
                can(Action.Manage, usertoken_schema_1.UserToken);
                can(Action.Manage, bill_schema_1.Bill);
                can(Action.Manage, cart_schema_1.Cart);
                can(Action.Create, store_schema_1.Store);
                can(Action.Read, store_schema_1.Store);
                can(Action.Read, user_schema_1.User);
                can(Action.Update, user_schema_1.User);
                can(Action.Delete, user_schema_1.User);
                can(Action.Manage, feedback_schema_1.Feedback);
                can(Action.Update, evaluation_schema_1.Evaluation);
                can(Action.Read, evaluation_schema_1.Evaluation);
                can(Action.Manage, notification_schema_1.Notification);
                can(Action.Manage, promotion_schema_1.Promotion);
                cannot(Action.Read, role_schema_1.Role).because('Không cho đọc role!');
                cannot(Action.Create, product_schema_1.Product).because('Không cho tạo sản phẩm!');
                break;
            case role_schema_1.RoleName.SELLER:
                can(Action.Manage, usertoken_schema_1.UserToken);
                can(Action.Read, bill_schema_1.Bill);
                can(Action.Update, bill_schema_1.Bill);
                can(Action.Manage, store_schema_1.Store);
                can(Action.Manage, product_schema_1.Product);
                can(Action.Manage, notification_schema_1.Notification);
                break;
            case role_schema_1.RoleName.MANAGER:
                can(Action.Manage, usertoken_schema_1.UserToken);
                can(Action.Manage, notification_schema_1.Notification);
                can(Action.Read, role_schema_1.Role);
                can(Action.Manage, user_schema_1.User);
                can(Action.Manage, store_schema_1.Store);
                break;
            default:
                break;
        }
        return build({
            detectSubjectType: item => item.constructor,
        });
    }
};
exports.AbilityFactory = AbilityFactory;
exports.AbilityFactory = AbilityFactory = __decorate([
    (0, common_1.Injectable)()
], AbilityFactory);
//# sourceMappingURL=ability.factory.js.map