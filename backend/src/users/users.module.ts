import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AddressController } from "./controllers/address.controller";
import { UsersController } from "./controllers/users.controller";
import { AddressRepository } from "./repository/address.repository";
import { Address, AddressSchema } from "./schemas/address.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { AddressService } from "./services/address.service";
import { UsersService } from "./services/users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  controllers: [AddressController, UsersController],
  providers: [UsersService, AddressService, AddressRepository],
  exports: [UsersService, AddressService],
})
export class UsersModule {}
