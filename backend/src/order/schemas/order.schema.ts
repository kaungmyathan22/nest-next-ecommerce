import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { SchemaUtils } from "src/utils/schema";
import { OrderItem, OrderItemSchema } from "./order-item.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  virtuals: true,
  versionKey: false,
  id: true,
})
export class Order extends Document {
  @Prop({
    enum: ["OrderPlaced", "InProgress", "Shipped", "Delivered", "Cancelled"],
    default: "OrderPlaced",
  })
  orderStatus: string;
  @Prop({ type: Types.ObjectId, ref: "user" })
  user: User;

  @Prop({ type: [OrderItemSchema] })
  orderItems: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});
