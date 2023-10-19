import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EnvironmentConstants } from "src/common/constants/environment.constants";
import { PaginatedParamsDto } from "src/common/dto/paginated-query.dto";
import { CreateCategoryDTO } from "../dto/category/create-category.dto";
import { UpdateCategoryDTO } from "../dto/category/update-category.dto";
import { Category } from "../schema/category.schema";
import { GenderService } from "./gender.service";

@Injectable()
export class CategoryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly genderService: GenderService,
    @InjectModel(Category.name)
    private CategoryModel: Model<Category>
  ) {}
  async createCategory({ name, gender_id }: CreateCategoryDTO) {
    try {
      const gender = await this.genderService.getGenderById(gender_id);
      if (!gender) {
        throw new NotFoundException("Gender with given id not found.");
      }
      const category = new this.CategoryModel({
        name,
        gender: gender._id,
      });
      await category.save();
      return category;
    } catch (error) {
      if (
        error.code ===
        +this.configService.get(EnvironmentConstants.DUPLICATE_ERROR_KEY)
      ) {
        throw new ConflictException(
          `Cateogry with name (${name}) already exists.`
        );
      }
      throw error;
    }
  }

  async getCategoryByGender(id: string, queryParams: PaginatedParamsDto) {
    const { page, pageSize } = queryParams;
    const totalItems = await this.CategoryModel.countDocuments({ gender: id });
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (page - 1) * pageSize;
    const data = await this.CategoryModel.find({ gender: id })
      .limit(pageSize)
      .skip(skip);
    return {
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page >= totalPages ? null : +page + 1,
      totalPages,
      totalItems,
      page,
      pageSize,
      data,
    };
  }

  async updateCategory(id: string, payload: UpdateCategoryDTO) {
    try {
      const result = await this.CategoryModel.findOneAndUpdate(
        { _id: id },
        { name: payload.name },
        { new: true }
      );
      if (!result) {
        throw new NotFoundException(
          `Category with given id (${id}) doesn't exists.`
        );
      }
      return result;
    } catch (error) {
      if (
        error.code ===
        +this.configService.get(EnvironmentConstants.DUPLICATE_ERROR_KEY)
      ) {
        throw new ConflictException(
          `Cateogry with name (${payload.name}) already exists.`
        );
      }
      throw error;
    }
  }

  async getCategoryById(id: string) {
    return this.CategoryModel.findOne({ _id: id });
  }
}
