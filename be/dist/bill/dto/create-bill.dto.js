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
exports.CreateBillDto = exports.GiveInfo = exports.ReceiverInfo = exports.CartInfo = exports.ProductInfo = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const payment_gateway_1 = require("../payment/payment.gateway");
class ProductInfo {
}
exports.ProductInfo = ProductInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductInfo.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductInfo.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductInfo.prototype, "type", void 0);
class CartInfo {
}
exports.CartInfo = CartInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CartInfo.prototype, "storeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductInfo] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CartInfo.prototype, "listProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CartInfo.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CartInfo.prototype, "totalPrice", void 0);
class ReceiverInfo {
}
exports.ReceiverInfo = ReceiverInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiverInfo.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiverInfo.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiverInfo.prototype, "address", void 0);
class GiveInfo {
}
exports.GiveInfo = GiveInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GiveInfo.prototype, "senderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GiveInfo.prototype, "wish", void 0);
class GiveInfoExample {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Van A" }),
    __metadata("design:type", String)
], GiveInfoExample.prototype, "senderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "wish something" }),
    __metadata("design:type", String)
], GiveInfoExample.prototype, "wish", void 0);
class CreateBillDto {
}
exports.CreateBillDto = CreateBillDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CartInfo] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateBillDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReceiverInfo }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", ReceiverInfo)
], CreateBillDto.prototype, "receiverInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: GiveInfo || null, example: GiveInfoExample || null }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", GiveInfo)
], CreateBillDto.prototype, "giveInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "deliveryFee", void 0);
//# sourceMappingURL=create-bill.dto.js.map