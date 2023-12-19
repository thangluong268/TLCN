import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import { CreateReportDto } from './dto/report.dto';
import { Report } from './schema/report.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<Report>,
  ) {}

  async create(createReportData: CreateReportDto, userId: string): Promise<Report> {
    try {
      const newReport = await this.reportModel.create(createReportData);
      newReport.status = false;
      newReport.userId = userId;
      await newReport.save();
      return newReport;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAllBySearch(pageQuery: number = 1, limitQuery: number = 5, searchQuery: string): Promise<{ total: number; reports: Report[] }> {
    const search = searchQuery
      ? {
          $or: [{ content: { $regex: searchQuery, $options: 'i' } }],
        }
      : {};
    const skip = Number(limitQuery) * (Number(pageQuery) - 1);
    try {
      const total = await this.reportModel.countDocuments({ ...search, status: false });
      const reports = await this.reportModel
        .find({ ...search, status: false })
        .sort({ createdAt: -1 })
        .limit(Number(limitQuery))
        .skip(skip);

      return { total, reports };
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getById(id: string): Promise<Report> {
    try {
      const report = await this.reportModel.findOne({ _id: id.toString(), status: false });
      return report;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getByProductIdAndUserId(productId: string, userId: string): Promise<Report> {
    try {
      const report = await this.reportModel.findOne({ productId: productId.toString(), userId: userId.toString() });
      return report;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async updateStatus(id: string): Promise<void> {
    try {
      await this.reportModel.updateOne({ _id: id.toString() }, { status: true });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async countByProductId(productId: string): Promise<number> {
    try {
      const total = await this.reportModel.countDocuments({ productId: productId.toString(), status: true });
      return total;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
}
