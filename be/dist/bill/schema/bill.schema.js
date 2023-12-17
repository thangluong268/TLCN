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
exports.BillSchema = exports.Bill = exports.PRODUCT_TYPE = exports.BILL_STATUS_TRANSITION = exports.BILL_STATUS = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const create_bill_dto_1 = require("../dto/create-bill.dto");
exports.BILL_STATUS = 'NEW-CONFIRMED-DELIVERING-DELIVERED-CANCELLED-RETURNED';
exports.BILL_STATUS_TRANSITION = {
    NEW: 'Đơn mới',
    CONFIRMED: 'Đang chuẩn bị',
    DELIVERING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Đã hoàn',
};
var PRODUCT_TYPE;
(function (PRODUCT_TYPE) {
    PRODUCT_TYPE["SELL"] = "SELL";
    PRODUCT_TYPE["GIVE"] = "GIVE";
})(PRODUCT_TYPE || (exports.PRODUCT_TYPE = PRODUCT_TYPE = {}));
let Bill = class Bill extends mongoose_2.Document {
};
exports.Bill = Bill;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "storeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Bill.prototype, "listProducts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Bill.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "deliveryMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", create_bill_dto_1.ReceiverInfo)
], Bill.prototype, "receiverInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object || null }),
    __metadata("design:type", create_bill_dto_1.GiveInfo)
], Bill.prototype, "giveInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Bill.prototype, "deliveryFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'NEW' }),
    __metadata("design:type", String)
], Bill.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Bill.prototype, "isPaid", void 0);
exports.Bill = Bill = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Bill);
exports.BillSchema = mongoose_1.SchemaFactory.createForClass(Bill);
//# sourceMappingURL=bill.schema.js.map