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
exports.FineService = void 0;
const common_1 = require("@nestjs/common");
const fine_shema_1 = require("./schema/fine.shema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
let FineService = class FineService {
    constructor(fineModel) {
        this.fineModel = fineModel;
    }
    async create(createFineDto) {
        try {
            return await this.fineModel.create(createFineDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async findAll() {
        try {
            return await this.fineModel.find({});
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, updateFineDto) {
        try {
            return await this.fineModel.findByIdAndUpdate(id, updateFineDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async remove(id) {
        try {
            return await this.fineModel.findByIdAndDelete(id);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.FineService = FineService;
exports.FineService = FineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fine_shema_1.Fine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FineService);
//# sourceMappingURL=fine.service.js.map