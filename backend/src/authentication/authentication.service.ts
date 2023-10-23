import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Model } from "mongoose";
import { EnvironmentConstants } from "src/common/constants/environment.constants";
import { EmailService } from "src/email/email.service";
import { UserDocument } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/services/users.service";
import { StringUtils } from "src/utils/strings";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { PasswordResetToken } from "./schemas/password-reset-token.schema";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectModel(PasswordResetToken.name)
    private PasswordResetTokenModel: Model<PasswordResetToken>
  ) {}

  async register(payload: RegisterDto) {
    return this.usersService.create(payload);
  }

  async login({ email, password }: LoginDTO) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email / password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email / password");
    }
    return user;
  }

  async logout() {
    return { success: true };
  }

  async changePassword(
    user: UserDocument,
    { oldPassword, newPassword }: ChangePasswordDTO
  ) {
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      throw new BadRequestException("Incorrect old password.");
    }
    await this.usersService.updatePassword(user.id, newPassword);
    return { success: true, message: "Successfully changed the password." };
  }

  async deleteAccount(user: UserDocument) {
    await this.usersService.remove(user.id);
    return { success: true };
  }

  async forgotPassword(payload: ForgotPasswordDTO) {
    const { email } = payload;
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const code = StringUtils.generateRandomString(20);
      const now = new Date();
      const expiresAt = new Date(now.setHours(now.getHours() + 24));
      const existingTokenInstance = await this.PasswordResetTokenModel.findOne({
        user: user._id,
      });
      if (existingTokenInstance) {
        existingTokenInstance.code = code;
        existingTokenInstance.expiresAt = expiresAt;
        await existingTokenInstance.save();
      } else {
        const tokenInstance = await this.PasswordResetTokenModel.create({
          user: user._id,
          code,
          expiresAt,
        });
        await tokenInstance.save();
      }
      const token = this.jwtService.sign(
        { email: user.email, code },
        {
          secret: this.configService.get(
            EnvironmentConstants.PASSWORD_RESET_TOKEN_SECRET
          ),
          expiresIn: +this.configService.get(
            EnvironmentConstants.PASSWORD_RESET_TOKEN_EXPIRES_IN
          ),
        }
      );
      const frontendURL = this.configService.get(
        EnvironmentConstants.FRONTNED_URL
      );
      this.emailService.sendEmail({
        to: "hello@gmail.com",
        template: "forgot-password",
        subject: "Password Reset Link",
        context: {
          resetLink: `${frontendURL}/?token=${token}`,
        },
      });
      return {
        message:
          "Password reset link has been sent to your email address. Please check your inbox.",
      };
    } else {
      throw new NotFoundException("User with this email not found.");
    }
  }

  async resetPassword({ newPassword, token }: ResetPasswordDTO) {
    try {
      const { email, code } = await this.jwtService.verify(token, {
        secret: this.configService.get(
          EnvironmentConstants.PASSWORD_RESET_TOKEN_SECRET
        ),
      });
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new Error("User not found.");
      }
      const resetTokenInstance = await this.PasswordResetTokenModel.findOne({
        user: user._id,
        code: code,
      });
      if (!resetTokenInstance) {
        throw new Error("Token Not Found.");
      }
      if (resetTokenInstance.expiresAt < new Date()) {
        this.PasswordResetTokenModel.deleteOne(resetTokenInstance._id);
        throw new Error("Token expired");
      }
      await Promise.all([
        this.usersService.updatePassword(user.id, newPassword),
        this.PasswordResetTokenModel.deleteOne(resetTokenInstance._id),
      ]);
      return {
        message: "Successfully changed your password. Please log back in.",
      };
    } catch (error) {
      throw new UnauthorizedException("Passwrod reset link expired");
    }
  }
}
