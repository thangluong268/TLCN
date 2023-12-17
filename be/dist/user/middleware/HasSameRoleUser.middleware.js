"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasSameRoleUserMiddleware = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const role_schema_1 = require("../../role/schema/role.schema");
const role_service_1 = require("../../role/role.service");
const error_response_1 = require("../../core/error.response");
const InternalServerErrorExceptionCustom_exception_1 = require("../../exceptions/InternalServerErrorExceptionCustom.exception");
let HasSameRoleUserMiddleware = class HasSameRoleUserMiddleware {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async use(req, res, next) {
        if (req.params.id) {
            try {
                const id1 = req.params.id;
                const id2 = req.body.id;
                const roles1 = await this.roleService.getRoleNameByUserId(id1);
                const roles2 = await this.roleService.getRoleNameByUserId(id2);
                if (!roles1 || !roles2) {
                    return new error_response_1.ForbiddenException("Bạn không có quyền thực hiện hành động này!");
                }
                if (roles1.includes(role_schema_1.RoleName.USER) || roles2.includes(role_schema_1.RoleName.USER)) {
                    {
                        return new error_response_1.ForbiddenException("Bạn không có quyền thực hiện hành động này!");
                    }
                }
            }
            catch (err) {
                if (err instanceof mongoose_1.MongooseError)
                    throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
                throw err;
            }
        }
        console.log("Pass HasSameRoleUserMiddleware");
        next();
    }
};
exports.HasSameRoleUserMiddleware = HasSameRoleUserMiddleware;
exports.HasSameRoleUserMiddleware = HasSameRoleUserMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], HasSameRoleUserMiddleware);
//# sourceMappingURL=HasSameRoleUser.middleware.js.map