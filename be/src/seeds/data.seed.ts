import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Command } from 'nestjs-command';
import { SignUpDto } from '../auth/dto/signup.dto';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { RoleService } from '../role/role.service';
import { RoleName } from '../role/schema/role.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class DataSeed {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async hashData(data: string): Promise<string> {
    const saltOrRounds = Number(process.env.SALT_ROUNDS);
    return await bcrypt.hash(data, saltOrRounds);
  }

  @Command({ command: 'create:data', describe: 'create a role and add user to role Admin' })
  async create() {
    await this.roleService.create({
      name: RoleName.ADMIN,
    });
    await this.roleService.create({
      name: RoleName.USER,
    });
    await this.roleService.create({
      name: RoleName.SELLER,
    });
    await this.roleService.create({
      name: RoleName.MANAGER_PRODUCT,
    });
    await this.roleService.create({
      name: RoleName.MANAGER_STORE,
    });
    await this.roleService.create({
      name: RoleName.MANAGER_USER,
    });

    const userInfo = new SignUpDto();
    userInfo.fullName = 'admin';
    userInfo.email = process.env.EMAIL_ADMIN;
    userInfo.password = await this.hashData(process.env.PASSWORD_ADMIN);

    const user = await this.userService.createNormal(userInfo);
    const adminRole = new CreateRoleDto();
    adminRole.name = RoleName.ADMIN;
    await this.roleService.addUserToRole(user._id, adminRole);
  }
}
