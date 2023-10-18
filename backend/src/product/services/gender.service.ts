import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnvironmentConstants } from 'src/common/constants/environment.constants';
import { PaginatedParamsDto } from 'src/common/dto/paginated-query.dto';
import { CreateGenderDTO } from '../dto/gender/create-gender.dto';
import { GenderDocument } from '../schema/gender.schema';

@Injectable()
export class GenderService {
  constructor(
    @InjectModel(GenderDocument.name)
    private GenderModel: Model<GenderDocument>,
    private readonly configService: ConfigService,
  ) {}

  async getGenders(queryParams: PaginatedParamsDto) {
    const { page, pageSize } = queryParams;
    const totalItems = await this.GenderModel.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (page - 1) * pageSize;
    const data = await this.GenderModel.find().limit(pageSize).skip(skip);
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

  async createGender(payload: CreateGenderDTO) {
    try {
      const gender = new this.GenderModel(payload);
      await gender.save();
      return gender;
    } catch (error) {
      if (
        error.code ===
        +this.configService.get(EnvironmentConstants.DUPLICATE_ERROR_KEY)
      ) {
        throw new ConflictException(
          `Gender with name (${payload.name}) already exists.`,
        );
      }
      throw error;
    }
  }
  async updateGender(id: string, payload: CreateGenderDTO) {
    try {
      const result = await this.GenderModel.findOneAndUpdate(
        { _id: id },
        { name: payload.name },
        { new: true },
      );
      if (!result) {
        throw new NotFoundException(`Gender not found with given id ${id}.`);
      }
      return result;
    } catch (error) {
      if (
        error.code ===
        +this.configService.get(EnvironmentConstants.DUPLICATE_ERROR_KEY)
      ) {
        throw new ConflictException(
          `Gender with name (${payload.name}) already exists.`,
        );
      }
      throw error;
    }
  }
}
