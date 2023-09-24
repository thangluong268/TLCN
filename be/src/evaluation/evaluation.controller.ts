import { Body, Controller, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, UpdateEvaluationAbility } from 'src/ability/decorators/abilities.decorator';
import { Types } from 'mongoose';
import { Request } from 'express';
import { BodyDto } from './dto/body.dto';

@Controller('evaluation')
@ApiTags('Evaluation')
@ApiBearerAuth('Authorization')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateEvaluationAbility())
  @ApiQuery({ name: 'productId', type: String, required: true })
  @ApiQuery({ name: 'type', type: String, required: true })
  @Put('user')
  async create(
    @Req() req: Request,
    @Query('productId') productId: string,
    @Query('type') type: string,
    @Body() body: BodyDto
  ): Promise<boolean> {
    const userId = req.user['userId']
    const result = this.evaluationService.update(userId, productId, body.body, type.toLowerCase())
    return result
  }
}
