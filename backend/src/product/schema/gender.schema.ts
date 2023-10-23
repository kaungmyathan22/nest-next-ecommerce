import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SchemaUtils } from "src/utils/schema";

@Schema({ versionKey: false, collection: "gender" })
export class GenderDocument extends Document {
  @Prop({ unique: true })
  name: string;
}

export const GenderSchema = SchemaFactory.createForClass(GenderDocument);

GenderSchema.set("toJSON", {
  virtuals: true,
  transform: SchemaUtils.transform,
});
