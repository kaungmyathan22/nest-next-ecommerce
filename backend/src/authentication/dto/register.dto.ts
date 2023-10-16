import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}
