import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "src/database/abstract.repository";
import { Address, AddressDocument } from "../schemas/address.schema";

@Injectable()
export class AddressRepository extends AbstractRepository<AddressDocument> {
  protected readonly logger = new Logger(AddressRepository.name);

  constructor(@InjectModel(Address.name) addressModel: Model<AddressDocument>) {
    super(addressModel);
  }
}
