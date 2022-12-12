import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../httpException.filter';
import { ValidationPipe } from '@nestjs/common';
import { StandardResponseInterceptor } from './common/interceptor/standard-response.interceptor';
import passport from 'passport';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new StandardResponseInterceptor());
  const config = new DocumentBuilder().setTitle('linkfit API').setDescription('linkfit API 문서입니다.').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(port);

  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
    console.log('hot reload.....');
  }
}
bootstrap();
