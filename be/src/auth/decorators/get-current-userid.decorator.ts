import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentUserId = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.user['userId'];
    },
);