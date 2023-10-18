import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaUtils } from 'src/utils/schema';

@Schema()
export class Colour {
  @Prop()
  color_hex: string;
  @Prop()
  price: number;
}

export const ColourSchema = SchemaFactory.createForClass(Colour);

ColourSchema.set('toJSON', {
  virtuals: true,
  transform: SchemaUtils.transform,
});
