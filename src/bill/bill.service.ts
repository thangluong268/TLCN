import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill, PRODUCT_TYPE } from './schema/bill.schema';
import { Model, Error as MongooseError } from 'mongoose';
import { CartInfo, GiveInfo, ProductInfo, ReceiverInfo } from './dto/create-bill.dto';
import { ProductBillDto } from './dto/product-bill.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import removeVietnameseTones from 'src/utils/removeVietNameseTones';
import sortByConditions from 'src/utils/sortByContitions';

@Injectable()
export class BillService {
    constructor(
        @InjectModel(Bill.name)
        private readonly billModel: Model<Bill>
    ) { }

    getTotalPriceWithPromotion(listProducts: ProductBillDto[], promotionValue: number): number {
        const productPrice = listProducts.reduce((total: number, product: ProductBillDto) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0)
        const totalPrice = productPrice - promotionValue
        return totalPrice
    }

    async create(userId: string, billDto: CartInfo, deliveryMethod: string, paymentMethod: string,
        receiverInfo: ReceiverInfo, giveInfo: GiveInfo, deliveryFee: number): Promise<Bill> {
        try {
            billDto.listProducts.forEach((product: ProductInfo) => {
                product.type = product.type.toUpperCase()
            })
            const billData = await this.billModel.create(billDto)
            billData.userId = userId
            billData.deliveryMethod = deliveryMethod
            billData.paymentMethod = paymentMethod
            billData.receiverInfo = receiverInfo
            if (giveInfo) billData.giveInfo = giveInfo
            billData.deliveryFee = deliveryFee
            paymentMethod === 'CASH' ? billData.isPaid = false : billData.isPaid = true
            billData.save()
            return billData
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async countTotalByStatus(storeId: string, status: string, year: number): Promise<number> {
        try {
            const query: any = { storeId, status }

            if (year) {
                query.$expr = {
                    $eq: [
                        { $year: '$createdAt' },
                        { $year: new Date(year) }
                    ]
                }
            }

            const total = await this.billModel.countDocuments({ ...query })

            return total

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom();
            throw err
        }
    }


    async calculateRevenueAllTime(storeId: string): Promise<number> {
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
            ])

            const totalRevenue = result[0]?.totalRevenue || 0

            return totalRevenue

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async calculateRevenueByYear(storeId: string, year: number): Promise<Record<string, any>> {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                        $expr: {
                            $eq: [
                                { $year: '$createdAt' },
                                { $year: new Date(year) }
                            ]
                        }
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ])

            // Tạo mảng chứa 12 tháng với doanh thu mặc định là 0
            const monthlyRevenue: Record<string, number> = {
                'Tháng 1': 0, 'Tháng 2': 0, 'Tháng 3': 0, 'Tháng 4': 0, 'Tháng 5': 0, 'Tháng 6': 0,
                'Tháng 7': 0, 'Tháng 8': 0, 'Tháng 9': 0, 'Tháng 10': 0, 'Tháng 11': 0, 'Tháng 12': 0,
            }

            // Chỉ chứa những tháng có thông tin
            // const monthlyRevenue: Record<number, number> = {}

            let totalRevenue = 0
            let minRevenue: { month: string; revenue: number } | null = null
            let maxRevenue: { month: string; revenue: number } | null = null

            result.forEach((entry: { _id: number; totalRevenue: number }) => {
                const month = entry._id
                const revenue = entry.totalRevenue

                monthlyRevenue[`Tháng ${month}`] = revenue
                totalRevenue += revenue

                if (!minRevenue || revenue < minRevenue.revenue) {
                    minRevenue = { month: `Tháng ${month}`, revenue }
                }

                if (!maxRevenue || revenue > maxRevenue.revenue) {
                    maxRevenue = { month: `Tháng ${month}`, revenue }
                }
            })

            const response = {
                data: monthlyRevenue,
                revenueTotalAllTime: await this.calculateRevenueAllTime(storeId),
                revenueTotalInYear: totalRevenue,
                minRevenue,
                maxRevenue,
            }

            return response

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async countCharityAllTime(storeId: string): Promise<number> {
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
                        'listProducts.type': `${PRODUCT_TYPE.GIVE.toUpperCase()}`,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCharity: { $sum: '$listProducts.quantity' },
                    },
                },
            ])

            const totalCharity = result[0]?.totalCharity || 0

            return totalCharity

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async countCharityByYear(storeId: string, year: number): Promise<Record<string, any>> {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                        $expr: {
                            $eq: [
                                { $year: '$createdAt' },
                                { $year: new Date(year) }
                            ]
                        }
                    },
                },
                {
                    $unwind: '$listProducts',
                },
                {
                    $match: {
                        'listProducts.type': `${PRODUCT_TYPE.GIVE.toUpperCase()}`,
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalCharity: { $sum: '$listProducts.quantity' },
                    },
                },
            ])

            // Tạo mảng chứa 12 tháng với tổng số lượng mặc định là 0
            const monthlyCharity: Record<string, number> = {
                'Tháng 1': 0, 'Tháng 2': 0, 'Tháng 3': 0, 'Tháng 4': 0, 'Tháng 5': 0, 'Tháng 6': 0,
                'Tháng 7': 0, 'Tháng 8': 0, 'Tháng 9': 0, 'Tháng 10': 0, 'Tháng 11': 0, 'Tháng 12': 0,
            }

            // Chỉ chứa những tháng có thông tin
            // const monthlyCharity: Record<number, number> = {}

            let totalGive = 0
            let minGive: { month: string; numOfGive: number } | null = null
            let maxGive: { month: string; numOfGive: number } | null = null

            result.forEach((entry: { _id: number; totalCharity: number }) => {
                const month = entry._id
                const numOfGive = entry.totalCharity

                monthlyCharity[`Tháng ${month}`] = numOfGive
                totalGive += numOfGive

                if (!minGive || numOfGive < minGive.numOfGive) {
                    minGive = { month: `Tháng ${month}`, numOfGive }
                }

                if (!maxGive || numOfGive > maxGive.numOfGive) {
                    maxGive = { month: `Tháng ${month}`, numOfGive }
                }
            })

            const response = {
                data: monthlyCharity,
                charityTotalAllTime: await this.countCharityAllTime(storeId),
                charityTotalInYear: totalGive,
                minGive,
                maxGive,
            }

            return response

        } catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async getAllByStatus(idCondition: any, pageQuery: number, limitQuery: number, statusQuery: string)
        : Promise<{ total: number, bills: Bill[] }> {

        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)

        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)

        const skip = limit * (page - 1)

        try {
            const total = await this.billModel.countDocuments({ ...idCondition, status: statusQuery.toUpperCase() })
            const bills = await this.billModel.find({ ...idCondition, status: statusQuery.toUpperCase() })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip)

            return { total, bills }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getById(id: string): Promise<Bill> {
        try {
            const bill = await this.billModel.findById(id)
            return bill
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(id: string, status: string): Promise<boolean> {
        try {
            const bill = await this.billModel.findByIdAndUpdate({ _id: id }, { status })
            if (bill.paymentMethod === 'CASH' && status === 'DELIVERED') {
                bill.isPaid = true
                bill.save()
            }
            return bill ? true : false
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async countProductDelivered(productId: string, type: string, status: string): Promise<number> {
        try {
            const total = await this.billModel.countDocuments({
                'listProducts': {
                    $elemMatch: {
                        'productId': productId.toString(),
                        'type': type.toUpperCase()
                    }
                },
                'status': status.toUpperCase()
            })
            return total
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async checkProductPurchased(productId: string): Promise<boolean> {
        try {
            const bill = await this.billModel.findOne({
                'listProducts': {
                    $elemMatch: {
                        'productId': productId.toString(),
                    }
                },
            })
            return bill ? true : false
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
