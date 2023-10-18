import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemaUtils } from 'src/utils/schema';
import { Category } from './category.schema';
import { Colour, ColourSchema } from './colour.schema';
import { Size, SizeSchema } from './size.schema';

@Schema({
  virtuals: true,
  versionKey: false,
  id: true,
})
export class Product extends Document {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop({ type: [SizeSchema] })
  sizes: Size[];
  @Prop({ type: [ColourSchema] })
  colours: Colour[];
  @Prop({ type: Types.ObjectId, ref: 'category' })
  category: Category;
  @Prop()
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.set('toJSON', {
  virtuals: true,
  transform: SchemaUtils.transform,
});
