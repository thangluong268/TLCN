import { HttpException, HttpStatus } from "@nestjs/common";
import { Translate, UpperCaseFirstLetter } from "./translate";

export class ConflictExceptionCustom extends HttpException {
    constructor(name: string) {
      super(UpperCaseFirstLetter(`${Translate[name]} đã tồn tại`), HttpStatus.CONFLICT);
    }
  }
