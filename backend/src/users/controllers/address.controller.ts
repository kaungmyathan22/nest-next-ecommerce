import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import JwtAuthenticationGuard from "src/authentication/guards/jwt.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { ObjectIdValidationPipe } from "src/common/pipes/object-id-validation.pipe";
import { PaginationQueryParamsValidationPipe } from "src/common/pipes/pagination-query-params-validation.pipe";
import { CreateAddressDto } from "../dto/address/create-address.dto";
import { UpdateAddressDTO } from "../dto/address/update-address.dto";
import { User } from "../schemas/user.schema";
import { AddressService } from "../services/address.service";

@Controller("api/v1/users/address")
@UseGuards(JwtAuthenticationGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @Post()
  createAddress(@Body() payload: CreateAddressDto, @CurrentUser() user: User) {
    return this.addressService.createAddress(user, payload);
  }
  @Get()
  getAddresses(@Query(PaginationQueryParamsValidationPipe) query) {
    return this.addressService.getAddresses(query);
  }
  @Get(":id")
  getAddresseById(
    @CurrentUser() user: User,
    @Param("id", ObjectIdValidationPipe) id: string
  ) {
    return this.addressService.getAddresseById(user, id);
  }
  @Patch(":id")
  updateAddresses(
    @CurrentUser() user: User,
    @Param("id", ObjectIdValidationPipe) id: string,
    @Body() payload: UpdateAddressDTO
  ) {
    return this.addressService.updateAddresses(user, id, payload);
  }
  @Delete(":id")
  deleteAddresses(
    @CurrentUser() user: User,
    @Param("id", ObjectIdValidationPipe) id: string
  ) {
    return this.addressService.deleteAddresses(user, id);
  }
}
