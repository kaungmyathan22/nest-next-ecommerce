import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { SchemaUtils } from "src/utils/schema";

@Schema({ versionKey: false, collection: "category" })
export class Category extends Document {
  @Prop()
  name: string;
  @Prop({ type: Types.ObjectId, ref: "gender" })
  gender: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});

CategorySchema.index({ name: 1, gender: 1 }, { unique: true });
