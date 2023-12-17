import { HttpException } from '@nestjs/common';
export declare class BadRequestException extends HttpException {
    constructor(message: string, rootError?: Error);
}
export declare class UnauthorizedException extends HttpException {
    constructor(message: string, rootError?: Error);
}
export declare class ForbiddenException extends HttpException {
    constructor(message: string, rootError?: Error);
}
export declare class NotFoundException extends HttpException {
    constructor(message: string, rootError?: Error);
}
export declare class ConflictException extends HttpException {
    constructor(message: string, rootError?: Error);
}
export declare class InternalServerErrorException extends HttpException {
    constructor(message: string, rootError?: Error);
}
