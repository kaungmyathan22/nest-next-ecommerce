import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentConstants } from './common/constants/environment.constants';
import { GlobalExceptionFilter } from './common/filters/global-expection.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const conigService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(conigService.get(EnvironmentConstants.PORT));
}
bootstrap();
