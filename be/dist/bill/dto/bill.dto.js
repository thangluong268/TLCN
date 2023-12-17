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
exports.BillDto = exports.ProductFullInfo = void 0;
const payment_gateway_1 = require("../payment/payment.gateway");
const store_schema_1 = require("../../store/schema/store.schema");
const create_bill_dto_1 = require("./create-bill.dto");
const user_schema_1 = require("../../user/schema/user.schema");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ProductFullInfo {
}
exports.ProductFullInfo = ProductFullInfo;
class BillDto {
}
exports.BillDto = BillDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", store_schema_1.Store)
], BillDto.prototype, "storeInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductFullInfo] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BillDto.prototype, "listProductsFullInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", user_schema_1.User)
], BillDto.prototype, "userInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BillDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], BillDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: create_bill_dto_1.ReceiverInfo }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", create_bill_dto_1.ReceiverInfo)
], BillDto.prototype, "receiverInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: create_bill_dto_1.GiveInfo || null }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", create_bill_dto_1.GiveInfo)
], BillDto.prototype, "giveInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], BillDto.prototype, "deliveryFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], BillDto.prototype, "isPaid", void 0);
//# sourceMappingURL=bill.dto.js.map