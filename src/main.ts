import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { warn } from 'console';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    // disableErrorMessages: true,
  }));

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API')
    .build();

    const document = SwaggerModule.createDocument(app, options, {
      include: [
        UserModule,
    ],
    });
    SwaggerModule.setup('docs', app, document);
    
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    warn(`App is listening to port ${PORT}`);
}
bootstrap();
