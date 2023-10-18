import { IsMongoId, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  name: string;
  @IsMongoId({ message: 'Invalid gender id' })
  gender_id: string;
}
