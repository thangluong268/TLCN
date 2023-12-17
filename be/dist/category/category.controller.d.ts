import { SuccessResponse } from '../core/success.response';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<SuccessResponse>;
    findAllByCategoryName(id: string, status: string): Promise<SuccessResponse>;
}
