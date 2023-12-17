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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
const bill_schema_1 = require("./schema/bill.schema");
let BillService = class BillService {
    constructor(billModel) {
        this.billModel = billModel;
    }
    getTotalPriceWithPromotion(listProducts, promotionValue) {
        const productPrice = listProducts.reduce((total, product) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0);
        const totalPrice = productPrice - promotionValue;
        return totalPrice;
    }
    async create(userId, billDto, deliveryMethod, paymentMethod, receiverInfo, giveInfo, deliveryFee) {
        try {
            billDto.listProducts.forEach((product) => {
                product.type = product.type.toUpperCase();
            });
            const billData = await this.billModel.create(billDto);
            billData.userId = userId;
            billData.deliveryMethod = deliveryMethod;
            billData.paymentMethod = paymentMethod;
            billData.receiverInfo = receiverInfo;
            if (giveInfo)
                billData.giveInfo = giveInfo;
            billData.deliveryFee = deliveryFee;
            paymentMethod === 'CASH' ? (billData.isPaid = false) : (billData.isPaid = true);
            billData.save();
            return billData;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countTotalByStatusSeller(storeId, status, year) {
        try {
            const query = { storeId, status };
            if (year) {
                query.$expr = {
                    $eq: [{ $year: '$createdAt' }, { $year: new Date(year) }],
                };
            }
            const total = await this.billModel.countDocuments({ ...query });
            return total;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countTotalByStatusUser(userId, status) {
        try {
            const query = { userId, status };
            const total = await this.billModel.countDocuments({ ...query });
            return total;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async calculateRevenueAllTime(storeId) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ]);
            const totalRevenue = result[0]?.totalRevenue || 0;
            return totalRevenue;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async calculateRevenueByYear(storeId, year) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                        $expr: {
                            $eq: [{ $year: '$createdAt' }, { $year: new Date(year) }],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ]);
            const monthlyRevenue = {
                'Tháng 1': 0,
                'Tháng 2': 0,
                'Tháng 3': 0,
                'Tháng 4': 0,
                'Tháng 5': 0,
                'Tháng 6': 0,
                'Tháng 7': 0,
                'Tháng 8': 0,
                'Tháng 9': 0,
                'Tháng 10': 0,
                'Tháng 11': 0,
                'Tháng 12': 0,
            };
            let totalRevenue = 0;
            let minRevenue = null;
            let maxRevenue = null;
            result.forEach((entry) => {
                const month = entry._id;
                const revenue = entry.totalRevenue;
                monthlyRevenue[`Tháng ${month}`] = revenue;
                totalRevenue += revenue;
                if (!minRevenue || revenue < minRevenue.revenue) {
                    minRevenue = { month: `Tháng ${month}`, revenue };
                }
                if (!maxRevenue || revenue > maxRevenue.revenue) {
                    maxRevenue = { month: `Tháng ${month}`, revenue };
                }
            });
            const response = {
                data: monthlyRevenue,
                revenueTotalAllTime: await this.calculateRevenueAllTime(storeId),
                revenueTotalInYear: totalRevenue,
                minRevenue,
                maxRevenue,
            };
            return response;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countCharityAllTime(storeId) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                    },
                },
                {
                    $unwind: '$listProducts',
                },
                {
                    $match: {
                        'listProducts.type': `${bill_schema_1.PRODUCT_TYPE.GIVE.toUpperCase()}`,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCharity: { $sum: '$listProducts.quantity' },
                    },
                },
            ]);
            const totalCharity = result[0]?.totalCharity || 0;
            return totalCharity;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countCharityByYear(storeId, year) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                        $expr: {
                            $eq: [{ $year: '$createdAt' }, { $year: new Date(year) }],
                        },
                    },
                },
                {
                    $unwind: '$listProducts',
                },
                {
                    $match: {
                        'listProducts.type': `${bill_schema_1.PRODUCT_TYPE.GIVE.toUpperCase()}`,
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalCharity: { $sum: '$listProducts.quantity' },
                    },
                },
            ]);
            const monthlyCharity = {
                'Tháng 1': 0,
                'Tháng 2': 0,
                'Tháng 3': 0,
                'Tháng 4': 0,
                'Tháng 5': 0,
                'Tháng 6': 0,
                'Tháng 7': 0,
                'Tháng 8': 0,
                'Tháng 9': 0,
                'Tháng 10': 0,
                'Tháng 11': 0,
                'Tháng 12': 0,
            };
            let totalGive = 0;
            let minGive = null;
            let maxGive = null;
            result.forEach((entry) => {
                const month = entry._id;
                const numOfGive = entry.totalCharity;
                monthlyCharity[`Tháng ${month}`] = numOfGive;
                totalGive += numOfGive;
                if (!minGive || numOfGive < minGive.numOfGive) {
                    minGive = { month: `Tháng ${month}`, numOfGive };
                }
                if (!maxGive || numOfGive > maxGive.numOfGive) {
                    maxGive = { month: `Tháng ${month}`, numOfGive };
                }
            });
            const response = {
                data: monthlyCharity,
                charityTotalAllTime: await this.countCharityAllTime(storeId),
                charityTotalInYear: totalGive,
                minGive,
                maxGive,
            };
            return response;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByStatus(idCondition, pageQuery, limitQuery, statusQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const skip = limit * (page - 1);
        try {
            const total = await this.billModel.countDocuments({ ...idCondition, status: statusQuery.toUpperCase() });
            const bills = await this.billModel
                .find({ ...idCondition, status: statusQuery.toUpperCase() })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);
            return { total, bills };
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getById(id) {
        try {
            const bill = await this.billModel.findById(id);
            return bill;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getMyBill(id, userId) {
        try {
            const bill = await this.billModel.findOne({ _id: id, userId });
            return bill;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, status) {
        try {
            const bill = await this.billModel.findByIdAndUpdate({ _id: id }, { status });
            if (bill.paymentMethod === 'CASH' && status === 'DELIVERED') {
                bill.isPaid = true;
                bill.save();
            }
            return bill ? true : false;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countProductDelivered(productId, type, status) {
        try {
            const total = await this.billModel.countDocuments({
                listProducts: {
                    $elemMatch: {
                        productId: productId.toString(),
                        type: type.toUpperCase(),
                    },
                },
                status: status.toUpperCase(),
            });
            return total;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async checkProductPurchased(productId) {
        try {
            const bill = await this.billModel.findOne({
                listProducts: {
                    $elemMatch: {
                        productId: productId.toString(),
                    },
                },
            });
            return bill ? true : false;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByUserId(userId) {
        try {
            const bills = await this.billModel.find({ userId });
            return bills;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async checkUserPurchasedByProductId(userId, productId) {
        try {
            const bill = await this.billModel.findOne({
                userId,
                listProducts: {
                    $elemMatch: {
                        productId: productId.toString(),
                    },
                },
            });
            return bill ? true : false;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.BillService = BillService;
exports.BillService = BillService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BillService);
//# sourceMappingURL=bill.service.js.map