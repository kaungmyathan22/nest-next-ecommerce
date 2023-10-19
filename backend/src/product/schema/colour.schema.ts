import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SchemaUtils } from "src/utils/schema";

@Schema({ versionKey: false, collection: "colour" })
export class Colour extends Document {
  @Prop()
  color_hex: string;
  @Prop()
  price: number;
}

export const ColourSchema = SchemaFactory.createForClass(Colour);

ColourSchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});
