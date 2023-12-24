import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CheckAbilities,
  CreatePromotionAbility,
  DeletePromotionAbility,
  ReadPromotionAbility,
  UpdatePromotionAbility,
} from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { RoleName } from '../role/schema/role.schema';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { PromotionService } from './promotion.service';

@Controller('promotion')
@ApiTags('Promotion')
@ApiBearerAuth('Authorization')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreatePromotionAbility())
  @CheckRole(RoleName.MANAGER_PRODUCT)
  @Post('manager')
  async create(@Body() createPromotionDto: CreatePromotionDto): Promise<SuccessResponse> {
    const data = await this.promotionService.create(createPromotionDto);
    return new SuccessResponse({
      message: 'Tạo chương trình khuyến mãi thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadPromotionAbility())
  @CheckRole(RoleName.MANAGER_PRODUCT)
  @Get('manager')
  @ApiQuery({ name: 'productType', type: String, required: false })
  async findAllByProductType(@Query('productType') productType: string): Promise<SuccessResponse> {
    const data = await this.promotionService.findAllByProductType(productType);
    return new SuccessResponse({
      message: 'Lấy danh sách chương trình khuyến mãi thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdatePromotionAbility())
  @CheckRole(RoleName.MANAGER_PRODUCT)
  @Put('manager/:id')
  async update(@Param('id') id: string, @Body() updatePromotionDto: CreatePromotionDto): Promise<SuccessResponse | NotFoundException> {
    const data = await this.promotionService.update(id, updatePromotionDto);
    if (!data) return new NotFoundException('Không tìm thấy chương trình khuyến mãi này!');
    return new SuccessResponse({
      message: 'Cập nhật chương trình khuyến mãi thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeletePromotionAbility())
  @CheckRole(RoleName.MANAGER_PRODUCT)
  @Delete('manager/:id')
  async remove(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const data = await this.promotionService.remove(id);
    if (!data) return new NotFoundException('Không tìm thấy chương trình khuyến mãi này!');
    return new SuccessResponse({
      message: 'Xóa chương trình khuyến mãi thành công!',
      metadata: { data },
    });
  }
}
