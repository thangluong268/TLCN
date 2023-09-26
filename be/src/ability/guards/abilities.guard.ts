import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AbilityFactory } from "../ability.factory"
import { CHECK_ABILITY, RequiredRule } from "../decorators/abilities.decorator"
import { ForbiddenError } from "@casl/ability"
import { RoleService } from "src/role/role.service"
import { Types } from "mongoose"
import { CHECK_ROLE } from "../decorators/role.decorator"


@Injectable()
export class AbilitiesGuard implements CanActivate {
    private param: string;
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
        private roleService: RoleService,
    ) {
    }
    initialize(param: string) {
        this.param = param;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || []
        const check_role = this.reflector.get<string[]>(CHECK_ROLE, context.getHandler()) || []
        const request = context.switchToHttp().getRequest()
        const user = request.user
        const userId = user.userId
        const roles = user.role || await this.roleService.getRoleNameByUserId(userId)
        var currentRole = ""
        check_role.forEach(role => {
            if (roles.includes(role)) currentRole = role
        })
        if (currentRole == "") { currentRole = roles.split(" - ")[0] }
        // if (!(roles.includes(check_role))) throw new UnauthorizedException()
        const ability = this.caslAbilityFactory.defineAbility(currentRole)
        try {
            rules.forEach(rule => {
                ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
            })
            return true
        }
        catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message)
            }
        }
    }

}