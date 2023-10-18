import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { PaginationQueryParamsValidationPipe } from 'src/common/pipes/pagination-query-params-validation.pipe';
import { CreateCategoryDTO } from '../dto/category/create-category.dto';
import { UpdateCategoryDTO } from '../dto/category/update-category.dto';
import { CategoryService } from '../services/category.service';

@Controller('api/v1/product/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  createCategory(@Body() payload: CreateCategoryDTO) {
    return this.categoryService.createCategory(payload);
  }

  @Get(':id')
  getCategories(
    @Query(PaginationQueryParamsValidationPipe) query,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.categoryService.getCategoryByGender(id, query);
  }

  @Patch(':id')
  updateCategories(
    @Body() payload: UpdateCategoryDTO,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.categoryService.updateCategory(id, payload);
  }
}
