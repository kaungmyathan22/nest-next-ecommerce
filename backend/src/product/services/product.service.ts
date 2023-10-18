import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedParamsDto } from 'src/common/dto/paginated-query.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../schema/product.schema';
import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private ProductModel: Model<Product>,
    private readonly categoryService: CategoryService,
  ) {}
  async create(payload: CreateProductDto) {
    const category = await this.categoryService.getCategoryById(
      payload.category,
    );
    if (!category) {
      throw new NotFoundException(
        'Category with given id not found in the database.',
      );
    }
    const product = new this.ProductModel({
      ...payload,
      category: category._id,
    });
    await product.save();
    return product;
  }

  async findAll(queryParams: PaginatedParamsDto) {
    const { page, pageSize } = queryParams;
    const skip = (page - 1) * pageSize;
    const [totalItems, data] = await Promise.all([
      await this.ProductModel.countDocuments(),
      await this.ProductModel.find().limit(pageSize).skip(skip),
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page > totalPages ? null : +page + 1,
      totalPages,
      totalItems,
      page,
      pageSize,
      data,
    };
  }

  async findOne(id: string) {
    const product = await this.ProductModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException('Product with given id not found.');
    }
    return product;
  }

  async update(id: string, payload: UpdateProductDto) {
    const product = await this.ProductModel.findOneAndUpdate(
      { _id: id },
      payload,
      { new: true },
    );
    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.ProductModel.deleteOne({ _id: product._id });
    return {
      success: true,
    };
  }
}
