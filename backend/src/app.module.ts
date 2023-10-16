import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import * as joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { CookieMiddleware } from './common/middlewares/cookie.middleware';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        PORT: joi.string().required(),
        REDIS_HOST: joi.string().required(),
        DUPLICATE_ERROR_KEY: joi.string().required(),
        USER_TOKEN_CACHE_KEY: joi.string().required(),
        REDIS_PORT: joi.number().required(),
        /* token */
        JWT_ACCESS_TOKEN_SECRET: joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRES_IN: joi.number().required(),
        JWT_REFRESH_TOKEN_SECRET: joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRES_IN: joi.number().required(),
        /* cookies */
        COOKIE_JWT_ACCESS_TOKEN_KEY: joi.string().required(),
        COOKIE_REFRESH_TOKEN_KEY: joi.string().required(),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        };
      },
    }),

    UsersModule,
    AuthenticationModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieMiddleware).forRoutes('*');
  }
}
