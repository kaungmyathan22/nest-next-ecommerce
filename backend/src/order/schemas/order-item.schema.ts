import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Colour, ColourSchema } from "src/product/schema/colour.schema";
import { Size, SizeSchema } from "src/product/schema/size.schema";
import { SchemaUtils } from "src/utils/schema";

@Schema()
export class OrderItem extends Document {
  @Prop()
  productName: string;
  @Prop()
  quantity: number;
  @Prop()
  productPrie: number;
  @Prop({ type: [SizeSchema] })
  sizes: Size[];
  @Prop({ type: [ColourSchema] })
  colours: Colour[];
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

OrderItemSchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});
