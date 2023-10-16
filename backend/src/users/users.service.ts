import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { EnvironmentConstants } from 'src/common/constants/environment.constants';
import { PaginatedParamsDto } from 'src/common/dto/paginated-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}
  async create(payload: CreateUserDto) {
    try {
      const createdUserDocument = new this.UserModel(payload);
      await createdUserDocument.save();
      return createdUserDocument;
    } catch (error) {
      if (
        error.code ===
        +this.configService.get(EnvironmentConstants.DUPLICATE_ERROR_KEY)
      ) {
        throw new ConflictException(
          `User with email(${payload.email}) already exists.`,
        );
      }
      throw error;
    }
  }

  async findAll(queryParams: PaginatedParamsDto) {
    const { page = 1, pageSize = 10 } = queryParams as PaginatedParamsDto;

    const totalItems = await this.UserModel.countDocuments();

    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (page - 1) * pageSize;

    const users = await this.UserModel.find().limit(pageSize).skip(skip);
    return {
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page > totalPages ? null : +page + 1,
      totalPages: +totalPages,
      totalItems: +totalItems,
      page: +page,
      pageSize: +pageSize,
      data: users,
    };
  }

  findByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  async findOneOrFail(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with given id ${id} not found.`);
    }
    return user;
  }

  async findOne(id: string) {
    const user = await this.UserModel.findById(id);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.UserModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
      {
        new: true,
      },
    );
    return updatedUser;
  }

  async updatePassword(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.UserModel.findOneAndUpdate(
      { _id: id },
      { password: hashedPassword },
    );
    return updatedUser;
  }

  async remove(id: string) {
    await Promise.all([
      await this.findOneOrFail(id),
      await this.UserModel.deleteOne({ _id: id }),
    ]);
    return { success: true };
  }
}
