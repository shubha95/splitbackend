import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { UnprocessableEntityException, ValidationPipe, VersioningType } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  // Collect ALL validation errors before returning — matches existing behaviour
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((e) =>
          Object.values(e.constraints || {}).map((msg) => ({
            field: e.property,
            message: msg,
          })),
        );
        return new UnprocessableEntityException(messages);
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 5001;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();
