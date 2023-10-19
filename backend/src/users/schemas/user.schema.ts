import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";
import { Document, HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
  virtuals: true,
  versionKey: false,
  id: true,
})
export class User extends Document {
  @Prop()
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, default: false })
  isVerified: string;
  @Exclude()
  @Prop({ required: true })
  password: string;

  async comparePassword(plainTextPassword: string) {
    return await bcrypt.compare(plainTextPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret, opt) => {
    delete ret.password;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
UserSchema.pre("save", async function () {
  if (this.isModified(this.password) || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
