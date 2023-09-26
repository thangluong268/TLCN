import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateProductAbility, DeleteProductAbility } from 'src/ability/decorators/abilities.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { Request } from 'express';
import { Types } from 'mongoose';
import { StoreService } from 'src/store/store.service';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { RoleName } from 'src/role/schema/role.schema';
import { CheckRole } from 'src/ability/decorators/role.decorator';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('Authorization')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly evaluationService: EvaluationService
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @Post('seller')
  async create(
    @Req() req: Request,
    @Body() product: CreateProductDto
  ): Promise<Product> {
    const userId = req.user['userId']
    const store = await this.storeService.getByUserId(userId)
    const newProduct = await this.productService.create(store._id, store.storeName, product)
    await this.evaluationService.create(newProduct._id)
    return newProduct
  }
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteProductAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/deleteProduct/:id')
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    const store = await this.productService.deleteProduct(id);
    return store
  }
}
