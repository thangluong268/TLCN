import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, CreateCategoryAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { Public } from '../auth/decorators/public.decorator';
import { SuccessResponse } from '../core/success.response';
import { RoleName } from '../role/schema/role.schema';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth('Authorization')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateCategoryAbility())
  @CheckRole(RoleName.MANAGER)
  // @Public()
  @Post('manager')
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<SuccessResponse> {
    const data = await this.categoryService.create(createCategoryDto);
    return new SuccessResponse({
      message: 'Tạo danh mục thành công!',
      metadata: { data },
    });
  }

  @Public()
  @Get('')
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAllByCategoryName(@Query('id') id: string, @Query('status') status: string): Promise<SuccessResponse> {
    const data = await this.categoryService.findAllByCategoryName(id, status);
    return new SuccessResponse({
      message: 'Lấy danh sách danh mục thành công!',
      metadata: { data },
    });
  }
}
