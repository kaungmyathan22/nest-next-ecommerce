import { ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentConstants } from "src/common/constants/environment.constants";
import { PaginatedParamsDto } from "src/common/dto/paginated-query.dto";
import { CreateAddressDto } from "../dto/address/create-address.dto";
import { UpdateAddressDTO } from "../dto/address/update-address.dto";
import { AddressRepository } from "../repository/address.repository";
import { AddressDocument } from "../schemas/address.schema";
import { User } from "../schemas/user.schema";

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly configService: ConfigService
  ) {}
  async createAddress(user: User, payload: CreateAddressDto) {
    try {
      return await this.addressRepository.create({
        ...payload,
        user: user._id,
      } as AddressDocument);
    } catch (error) {
      if (
        error.code ===
        +this.configService.get(EnvironmentConstants.DUPLICATE_ERROR_KEY)
      ) {
        throw new ConflictException(
          `Address with name (${payload.name}) already exists.`
        );
      }
      throw error;
    }
  }
  getAddresses(query: PaginatedParamsDto) {
    return this.addressRepository.findAllWithPaginated(query);
  }
  getAddresseById(user: User, id: string) {
    return this.addressRepository.findOne({
      _id: id,
      user: user._id,
    });
  }
  updateAddresses(user: User, id: string, payload: UpdateAddressDTO) {
    return this.addressRepository.findOneAndUpdate(
      { user: user._id, _id: id },
      payload
    );
  }
  async deleteAddresses(user: User, id: string) {
    await Promise.all([
      this.addressRepository.findOne({ _id: id, user: user._id }),
      this.addressRepository.remove({ user: user._id, _id: id }),
    ]);
    return { success: true };
  }
}
