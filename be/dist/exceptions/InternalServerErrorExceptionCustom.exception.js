"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorExceptionCustom = void 0;
const common_1 = require("@nestjs/common");
class InternalServerErrorExceptionCustom extends common_1.HttpException {
    constructor() {
        super("Lỗi hệ thống, vui lòng quay lại sau giây lát...", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalServerErrorExceptionCustom = InternalServerErrorExceptionCustom;
//# sourceMappingURL=InternalServerErrorExceptionCustom.exception.js.map