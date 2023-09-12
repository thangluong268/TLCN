import { HttpException, HttpStatus } from "@nestjs/common";

export class PolicyNotFoundException extends HttpException {
    constructor(id?: string) {
      super(`Policy by id: ${id} not found`, HttpStatus.NOT_FOUND);
    }
  }