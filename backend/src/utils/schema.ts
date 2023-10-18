export class SchemaUtils {
  static transform(_doc: any, ret: Record<string, any>, _options: any) {
    delete ret.password;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
}
