import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
} from "class-validator";

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductItem)
  proudctItems: ProductItem[];
}

class ProductItem {
  @IsMongoId()
  id: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsArray()
  @Transform(({ value }) => value.map(String))
  @IsMongoId({ each: true })
  sizes: string[];

  @IsArray()
  @Transform(({ value }) => value.map(String))
  @IsMongoId({ each: true })
  colours: string[];
}
