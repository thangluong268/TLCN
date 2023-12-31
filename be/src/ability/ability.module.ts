import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { AbilitiesGuard } from './guards/abilities.guard';
import { Role } from '../role/schema/role.schema';

@Module({
    providers: [AbilityFactory],
    exports: [AbilityFactory],
})
export class AbilityModule {}
