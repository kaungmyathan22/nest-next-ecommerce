import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.document';
import { SchemaUtils } from 'src/utils/schema';
import { Gender } from './gender.schema';

@Schema()
export class Category extends AbstractDocument {
  @Prop()
  name: string;
  @Prop({ type: Types.ObjectId, ref: 'gender' })
  gender: Gender;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.set('toJSON', {
  virtuals: true,
  transform: SchemaUtils.transform,
});
