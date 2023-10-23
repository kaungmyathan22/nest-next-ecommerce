import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  country_region: string;
  @IsString()
  @IsNotEmpty()
  companyName: string;
  @IsString()
  @IsNotEmpty()
  streetAddress: string;
  @IsString()
  @IsNotEmpty()
  apartment_suite_unit: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  state: string;
  @IsString()
  @IsNotEmpty()
  postalCode: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
}
