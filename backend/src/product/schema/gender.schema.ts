import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.document';
import { SchemaUtils } from 'src/utils/schema';

@Schema()
export class Gender extends AbstractDocument {
  @Prop()
  name: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);

GenderSchema.set('toJSON', {
  virtuals: true,
  transform: SchemaUtils.transform,
});
