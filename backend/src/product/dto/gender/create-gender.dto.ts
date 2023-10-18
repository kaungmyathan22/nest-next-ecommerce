import { IsString } from 'class-validator';

export class CreateGenderDTO {
  @IsString()
  name: string;
}
