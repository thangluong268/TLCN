"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorException = exports.ConflictException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = void 0;
const common_1 = require("@nestjs/common");
class BadRequestException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.BAD_REQUEST);
        this.name = 'BadRequestException';
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.UNAUTHORIZED);
        this.name = 'UnauthorizedException';
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.FORBIDDEN);
        this.name = 'ForbiddenException';
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.NOT_FOUND);
        this.name = 'NotFoundException';
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.CONFLICT);
        this.name = 'ConflictException';
    }
}
exports.ConflictException = ConflictException;
class InternalServerErrorException extends common_1.HttpException {
    constructor(message, rootError) {
        if (rootError && rootError instanceof common_1.HttpException) {
            super(rootError.getResponse(), rootError.getStatus());
            this.name = rootError.name;
        }
        else {
            super({ message, rootError }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            this.name = 'InternalServerErrorException';
        }
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
//# sourceMappingURL=error.response.js.map