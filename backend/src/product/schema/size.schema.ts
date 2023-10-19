import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SchemaUtils } from "src/utils/schema";

@Schema({ collection: "size" })
export class Size extends Document {
  @Prop()
  name: string;

  @Prop()
  price: number;
}

export const SizeSchema = SchemaFactory.createForClass(Size);

SizeSchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});
