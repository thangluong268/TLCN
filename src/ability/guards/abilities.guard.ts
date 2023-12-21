import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../../role/role.service';
import { AbilityFactory } from '../ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../decorators/abilities.decorator';
import { CHECK_ROLE } from '../decorators/role.decorator';
import { RoleName } from '../../role/schema/role.schema';
import { ForbiddenException } from 'src/core/error.response';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  private param: string;
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
    private roleService: RoleService,
  ) {}
  initialize(param: string) {
    this.param = param;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const checkRoles = this.reflector.get<string[]>(CHECK_ROLE, context.getHandler()) || [];
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = user.userId;
    const roles = user.role || (await this.roleService.getRoleNameByUserId(userId));
    const arrRoles: string[] = roles.split(' - ');

    const currentRole: string[] = [];
    checkRoles.forEach(checkRole => {
      const index = arrRoles.findIndex(role => role === checkRole);
      if (index !== -1) {
        currentRole.push(checkRole);
      }
    });

    if (currentRole.length === 0 && arrRoles.some(role => role !== RoleName.ADMIN)) {
      return new ForbiddenException('Người dùng không có quyền truy cập!');
    }

    const result = currentRole.map(role => {
      const ability = this.caslAbilityFactory.defineAbility(role);
      try {
        rules.forEach(rule => {
          ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
        });

        return true;
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new ForbiddenException(error.message);
        }
      }
    });

    return result.some(item => item === false) ? false : true;
  }
}
