// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Request } from 'express';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { EnvironmentConstants } from 'src/common/constants/environment.constants';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class PasswordResetStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refresh-token',
// ) {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly userService: UsersService,
//   ) {
//     super({
//       jwtFromRequest: (req: Request) => {
//         const cookieRefreshToken =
//           req.cookies[
//             configService.get(EnvironmentConstants.COOKIE_REFRESH_TOKEN_KEY)
//           ]; // Attempt to get token from cookies
//         const headerRefreshToken = ExtractJwt.fromExtractors([
//           (request: Request) => {
//             return request?.cookies?.Refresh;
//           },
//         ])(req);
//         return headerRefreshToken || cookieRefreshToken;
//       },
//       secretOrKey: configService.get(
//         EnvironmentConstants.JWT_REFRESH_TOKEN_SECRET,
//       ),
//       passReqToCallback: true,
//     });
//   }

//   async validate(request: Request, payload: JWTRefreshPaylaod) {
//     const refreshToken = request.cookies?.Refresh;
//     const isTokenValid = await this.refreshTokenService.isRefreshTokenValid(
//       payload.id,
//       refreshToken,
//     );
//     if (isTokenValid) {
//       return await this.userService.findOne(payload.id);
//     }
//   }
// }
