import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { PaginationQueryParamsValidationPipe } from 'src/common/pipes/pagination-query-params-validation.pipe';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from '../services/product.service';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productService.create(payload);
  }

  @Get()
  findAll(@Query(PaginationQueryParamsValidationPipe) query) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.productService.remove(id);
  }
}
