import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Order } from "src/order/schemas/order.schema";
import { SchemaUtils } from "src/utils/schema";
import { User } from "./user.schema";

export type AddressDocument = HydratedDocument<Address>;

@Schema({
  virtuals: true,
  versionKey: false,
  id: true,
})
export class Address extends Document {
  @Prop({ type: Types.ObjectId, ref: "user" })
  user: User;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  country_region: string;
  @Prop()
  companyName: string;
  @Prop()
  streetAddress: string;
  @Prop()
  apartment_suite_unit: string;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop()
  postalCode: string;
  @Prop()
  phone: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});
