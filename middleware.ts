import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from './src/core/error.response';

@Injectable()
export class MyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const canActivateResult = req['canActivateResult'];
    console.log(11111)
    if (canActivateResult === false) {
      return new ForbiddenException('Bạn không có quyền truy cập!');
    } else {
      next();
    }
  }
}
