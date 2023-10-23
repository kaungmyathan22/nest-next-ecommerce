import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { SchemaUtils } from "src/utils/schema";
import { User } from "./user.schema";

export type AddressDocument = HydratedDocument<Address>;

@Schema({
  virtuals: true,
  versionKey: false,
  id: true,
  validateBeforeSave: true,
})
export class Address extends Document {
  @Prop({ type: Types.ObjectId, ref: "user" })
  user: User;
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  country_region: string;
  @Prop({ required: true })
  companyName: string;
  @Prop({ required: true })
  streetAddress: string;
  @Prop({ required: true })
  apartment_suite_unit: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: true })
  postalCode: string;
  @Prop({ required: true })
  phone: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

AddressSchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});
