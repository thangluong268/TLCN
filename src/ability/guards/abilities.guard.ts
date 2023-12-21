import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '../../core/error.response';
import { RoleService } from '../../role/role.service';
import { RoleName } from '../../role/schema/role.schema';
import { AbilityFactory } from '../ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../decorators/abilities.decorator';
import { CHECK_ROLE } from '../decorators/role.decorator';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async canActivate(context: ExecutionContext): Promise<any> {
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
      return new ForbiddenException('Bạn không có quyền truy cập!');
    }

    currentRole.forEach(role => {
      const ability = this.caslAbilityFactory.defineAbility(role);
      try {
        rules.forEach(rule => {
          ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
        });

        return true;
      } catch (error) {
        if (error instanceof ForbiddenError) {
          return new ForbiddenException('Bạn không có quyền truy cập!');
        }
      }
    });
  }
}
