import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class SizeDTO {
  @IsString()
  name: string;
  @IsNumber()
  price: number;
}

class ColourDTO {
  @IsString()
  color_hex: string;
  @IsNumber()
  price: number;
}

export class CreateProductDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDTO)
  sizes: SizeDTO[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColourDTO)
  colours: ColourDTO[];
  @IsMongoId()
  category: string;
  @IsNumber()
  price: number;
}
