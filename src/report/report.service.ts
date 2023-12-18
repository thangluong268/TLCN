import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import { Report } from './schema/report.schema';
import { CreateReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<Report>,
  ) {}

  async create(createReportData: CreateReportDto, userId: string): Promise<Report> {
    try {
      const newReport = await this.reportModel.create(createReportData);
      newReport.userId = userId;
      await newReport.save();
      return newReport;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
}
