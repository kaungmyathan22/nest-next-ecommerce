import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDTO {
  @IsStrongPassword()
  newPassword: string;
  @IsString()
  token: string;
}
