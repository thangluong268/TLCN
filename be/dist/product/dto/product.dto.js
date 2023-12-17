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
exports.FilterDate = exports.FilterProduct = exports.ExcludeIds = exports.ProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ProductDto {
}
exports.ProductDto = ProductDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ProductDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ProductDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "storeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "storeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "quantitySold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "quantityGive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "revenue", void 0);
class ExcludeIds {
}
exports.ExcludeIds = ExcludeIds;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: true, example: ['65773c715dd856a17de6fc97', '65773c715dd856a17de6fc91'] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ExcludeIds.prototype, "ids", void 0);
class FilterProduct {
}
exports.FilterProduct = FilterProduct;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Price Min', type: Number, required: false, example: 100000 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Price Max', type: Number, required: false, example: 300000 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Quantity Min', type: Number, required: false, example: 1 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "quantityMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Quantity Max', type: Number, required: false, example: 10 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "quantityMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter createdAt Min', required: false, example: '2023-01-01' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : null)),
    __metadata("design:type", Date)
], FilterProduct.prototype, "createdAtMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter createdAt Max', required: false, example: '2024-01-01' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : null)),
    __metadata("design:type", Date)
], FilterProduct.prototype, "createdAtMax", void 0);
class FilterDate {
}
exports.FilterDate = FilterDate;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Next element', required: false, example: '2023-01-01' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : null)),
    __metadata("design:type", Date)
], FilterDate.prototype, "date", void 0);
//# sourceMappingURL=product.dto.js.map