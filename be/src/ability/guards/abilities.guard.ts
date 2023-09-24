import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AbilityFactory } from "../ability.factory"
import { CHECK_ABILITY, RequiredRule } from "../decorators/abilities.decorator"
import { ForbiddenError } from "@casl/ability"
import { RoleService } from "src/role/role.service"
import { Types } from "mongoose"


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
<<<<<<< HEAD
        const userId = user.role || new Types.ObjectId(user.userId)
=======
        const userId = user.userId
>>>>>>> 98c465016add8743edb49e9db73ebd1626228285
        const role = user.role || await this.roleService.getRoleNameByUserId(userId)
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