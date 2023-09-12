import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AbilityFactory } from "./ability.factory"
import { CHECK_ABILITY, RequiredRule } from "./abilities.decorator"
import { ForbiddenError } from "@casl/ability"
import { RoleService } from "src/role/role.service"


@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
        private roleService: RoleService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || []
        const request = context.switchToHttp().getRequest()
        const user = request.user
        const role = await this.roleService.getRoleNameByUserId(user.userId)
        const ability = this.caslAbilityFactory.defineAbility(role)

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