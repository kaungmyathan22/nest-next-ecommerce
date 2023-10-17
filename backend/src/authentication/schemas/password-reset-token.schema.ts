import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class PasswordResetToken {
  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: User;
  @Prop()
  code: string;
  @Prop()
  expiresAt: Date;
}

export const PasswordResetTokenSchema =
  SchemaFactory.createForClass(PasswordResetToken);
